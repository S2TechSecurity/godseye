import { describe, expect, it } from 'vitest';
import {
  CI_LAB_BLOCKED_ACTIONS,
  evaluateCiLabRequest,
} from '../../src/s2ci/lab/policy.js';
import { createCiLabRun } from '../../src/s2ci/lab/run.js';

describe('S2 CI lab policy', () => {
  it('allows public feed health as read-only without approval', () => {
    const result = evaluateCiLabRequest({
      action: 'FEED_HEALTH',
      targetClass: 'PUBLIC_OSINT',
      targetRef: 'public-feeds',
    });

    expect(result).toEqual({
      allowed: true,
      code: 'ALLOWED',
      approvalRequired: false,
      authorizationRequired: false,
      privacyClass: 'INTERNAL',
      runMode: 'READ_ONLY',
    });
  });

  it('allows public OSINT enrichment as read-only', () => {
    const result = evaluateCiLabRequest({
      action: 'OSINT_ENRICHMENT',
      targetClass: 'PUBLIC_OSINT',
      targetRef: 'incident-context',
    });

    expect(result.allowed).toBe(true);
    expect(result.runMode).toBe('READ_ONLY');
  });

  it('rejects an unknown target class', () => {
    const result = evaluateCiLabRequest({
      action: 'FEED_HEALTH',
      targetClass: 'UNKNOWN',
      targetRef: 'x',
    });

    expect(result.allowed).toBe(false);
    expect(result.code).toBe('TARGET_CLASS_UNKNOWN');
  });

  it('does not allow defensive validation against public OSINT targets', () => {
    const result = evaluateCiLabRequest({
      action: 'DEFENSIVE_VALIDATION',
      targetClass: 'PUBLIC_OSINT',
      targetRef: 'public-host',
      authorizationRef: 'AUTH-1',
      approved: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.code).toBe('TARGET_CLASS_NOT_ALLOWED');
  });

  it('requires an authorization reference for defensive validation', () => {
    const result = evaluateCiLabRequest({
      action: 'DEFENSIVE_VALIDATION',
      targetClass: 'S2_OWNED',
      targetRef: 'lab-service',
      approved: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.code).toBe('AUTHORIZATION_REQUIRED');
  });

  it('requires human approval for authorized defensive validation', () => {
    const result = evaluateCiLabRequest({
      action: 'DEFENSIVE_VALIDATION',
      targetClass: 'S2_OWNED',
      targetRef: 'lab-service',
      authorizationRef: 'S2-LAB-001',
    });

    expect(result.allowed).toBe(false);
    expect(result.code).toBe('APPROVAL_REQUIRED');
    expect(result.approvalRequired).toBe(true);
  });

  it('allows defensive validation only after authorization and approval', () => {
    const result = evaluateCiLabRequest({
      action: 'DEFENSIVE_VALIDATION',
      targetClass: 'S2_OWNED',
      targetRef: 'lab-service',
      authorizationRef: 'S2-LAB-001',
      approved: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.runMode).toBe('SECURITY_TEST');
    expect(result.privacyClass).toBe('SENSITIVE_SECURITY');
  });

  it('requires authorization for passive recon of an authorized client', () => {
    const blocked = evaluateCiLabRequest({
      action: 'PASSIVE_RECON',
      targetClass: 'AUTHORIZED_CLIENT',
      targetRef: 'client-lab',
    });
    const allowed = evaluateCiLabRequest({
      action: 'PASSIVE_RECON',
      targetClass: 'AUTHORIZED_CLIENT',
      targetRef: 'client-lab',
      authorizationRef: 'CLIENT-AUTH-001',
    });

    expect(blocked.code).toBe('AUTHORIZATION_REQUIRED');
    expect(allowed.allowed).toBe(true);
  });

  it.each(CI_LAB_BLOCKED_ACTIONS)('hard-blocks %s', (action) => {
    const result = evaluateCiLabRequest({
      action,
      targetClass: 'S2_OWNED',
      targetRef: 'lab-service',
      authorizationRef: 'S2-LAB-001',
      approved: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.code).toBe('ACTION_BLOCKED');
  });

  it('run receipt copies only the bounded request contract', () => {
    const run = createCiLabRun(
      {
        scenarioId: 'LAB-001',
        action: 'FEED_HEALTH',
        targetClass: 'PUBLIC_OSINT',
        targetRef: 'public-feeds',
        secret: 'must-not-leak',
      },
      {
        runId: 'run-test-1',
        createdAt: '2026-10-07T02:45:00.000Z',
      },
    );

    expect(run.runId).toBe('run-test-1');
    expect(run.status).toBe('READY');
    expect(run).not.toHaveProperty('secret');
    expect(JSON.stringify(run)).not.toContain('must-not-leak');
  });
});

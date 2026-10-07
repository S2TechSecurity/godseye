import crypto from 'node:crypto';
import { evaluateCiLabRequest } from './policy.js';

export function createCiLabRun(request, options = {}) {
  const decision = evaluateCiLabRequest(request);
  const createdAt = options.createdAt || new Date().toISOString();
  const runId = options.runId || crypto.randomUUID();

  return {
    runId,
    scenarioId: typeof request.scenarioId === 'string' ? request.scenarioId : null,
    action: typeof request.action === 'string' ? request.action : null,
    targetClass: typeof request.targetClass === 'string' ? request.targetClass : null,
    targetRef: typeof request.targetRef === 'string' ? request.targetRef : null,
    authorizationRef:
      typeof request.authorizationRef === 'string' ? request.authorizationRef : null,
    approved: request.approved === true,
    decision,
    createdAt,
    status: decision.allowed ? 'READY' : 'BLOCKED',
  };
}

export const CI_LAB_TARGET_CLASSES = Object.freeze([
  'PUBLIC_OSINT',
  'S2_OWNED',
  'AUTHORIZED_CLIENT',
]);

export const CI_LAB_ACTIONS = Object.freeze([
  'FEED_HEALTH',
  'OSINT_ENRICHMENT',
  'PASSIVE_RECON',
  'DEFENSIVE_VALIDATION',
]);

export const CI_LAB_BLOCKED_ACTIONS = Object.freeze([
  'EXPLOIT',
  'CREDENTIAL_ATTACK',
  'PERSISTENCE',
  'EVASION',
  'DATA_EXFILTRATION',
  'DESTRUCTIVE_ACTION',
  'UNKNOWN_TARGET_ATTACK',
]);

const targetSet = new Set(CI_LAB_TARGET_CLASSES);
const blockedActionSet = new Set(CI_LAB_BLOCKED_ACTIONS);

const actionPolicy = Object.freeze({
  FEED_HEALTH: {
    allowedTargets: new Set(['PUBLIC_OSINT', 'S2_OWNED']),
    approvalRequired: false,
    authorizationRequired: false,
    runMode: 'READ_ONLY',
    privacyClass: 'INTERNAL',
  },
  OSINT_ENRICHMENT: {
    allowedTargets: new Set(['PUBLIC_OSINT', 'S2_OWNED', 'AUTHORIZED_CLIENT']),
    approvalRequired: false,
    authorizationRequired: false,
    runMode: 'READ_ONLY',
    privacyClass: 'INTERNAL',
  },
  PASSIVE_RECON: {
    allowedTargets: new Set(['S2_OWNED', 'AUTHORIZED_CLIENT']),
    approvalRequired: false,
    authorizationRequired: false,
    runMode: 'READ_ONLY',
    privacyClass: 'SENSITIVE_SECURITY',
  },
  DEFENSIVE_VALIDATION: {
    allowedTargets: new Set(['S2_OWNED', 'AUTHORIZED_CLIENT']),
    approvalRequired: true,
    authorizationRequired: true,
    runMode: 'SECURITY_TEST',
    privacyClass: 'SENSITIVE_SECURITY',
  },
});

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function evaluateCiLabRequest(request = {}) {
  const action = request.action;
  const targetClass = request.targetClass;

  if (blockedActionSet.has(action)) {
    return {
      allowed: false,
      code: 'ACTION_BLOCKED',
      approvalRequired: false,
      authorizationRequired: false,
    };
  }

  const policy = actionPolicy[action];
  if (!policy) {
    return {
      allowed: false,
      code: 'ACTION_UNKNOWN',
      approvalRequired: false,
      authorizationRequired: false,
    };
  }

  if (!targetSet.has(targetClass)) {
    return {
      allowed: false,
      code: 'TARGET_CLASS_UNKNOWN',
      approvalRequired: policy.approvalRequired,
      authorizationRequired: policy.authorizationRequired,
    };
  }

  if (!policy.allowedTargets.has(targetClass)) {
    return {
      allowed: false,
      code: 'TARGET_CLASS_NOT_ALLOWED',
      approvalRequired: policy.approvalRequired,
      authorizationRequired: policy.authorizationRequired,
    };
  }

  if (!nonEmptyString(request.targetRef)) {
    return {
      allowed: false,
      code: 'TARGET_REFERENCE_REQUIRED',
      approvalRequired: policy.approvalRequired,
      authorizationRequired: policy.authorizationRequired,
    };
  }

  const authorizationRequired =
    policy.authorizationRequired || targetClass === 'AUTHORIZED_CLIENT';

  if (authorizationRequired && !nonEmptyString(request.authorizationRef)) {
    return {
      allowed: false,
      code: 'AUTHORIZATION_REQUIRED',
      approvalRequired: policy.approvalRequired,
      authorizationRequired: true,
    };
  }

  if (policy.approvalRequired && request.approved !== true) {
    return {
      allowed: false,
      code: 'APPROVAL_REQUIRED',
      approvalRequired: true,
      authorizationRequired,
      privacyClass: policy.privacyClass,
      runMode: policy.runMode,
    };
  }

  return {
    allowed: true,
    code: 'ALLOWED',
    approvalRequired: policy.approvalRequired,
    authorizationRequired,
    privacyClass: policy.privacyClass,
    runMode: policy.runMode,
  };
}

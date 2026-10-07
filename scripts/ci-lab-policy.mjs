import { evaluateCiLabRequest } from '../src/s2ci/lab/policy.js';

function readArgs(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      out[name] = next;
      index += 1;
    } else {
      out[name] = true;
    }
  }
  return out;
}

const args = readArgs(process.argv.slice(2));
const request = {
  scenarioId: args['scenario-id'] || null,
  action: args.action,
  targetClass: args['target-class'],
  targetRef: args['target-ref'],
  authorizationRef: args['authorization-ref'],
  approved: args.approved === true || args.approved === 'true',
};

const decision = evaluateCiLabRequest(request);

process.stdout.write(
  JSON.stringify(
    {
      request: {
        scenarioId: request.scenarioId,
        action: request.action,
        targetClass: request.targetClass,
        targetRef: request.targetRef,
        authorizationRef: request.authorizationRef || null,
        approved: request.approved,
      },
      decision,
    },
    null,
    2,
  ) + '\n',
);

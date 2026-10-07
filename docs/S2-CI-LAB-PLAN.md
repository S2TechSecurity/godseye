# S2 Crime Intelligence Lab Plan

Status: ACTIVE
Canonical repo: D:\dev\godseye
Integration owner: S2 Intelligence
Control plane: Captain / OpenClaw
Primary future operational URL: ci.s2tech.co.za

## Purpose

Turn the existing geospatial intelligence application into a controlled S2 Intelligence lab and operational intelligence surface.

The lab exists to test:
- public OSINT collection;
- feed health and source freshness;
- source correlation;
- geospatial intelligence workflows;
- incident enrichment;
- S2-owned defensive validation;
- explicitly authorized client defensive validation;
- evidence and after-action workflows.

It is not an unrestricted offensive-security environment.

## Current baseline

Existing CI capabilities include:
- Cesium 3D common operating picture;
- live/open aircraft feeds;
- satellite feeds;
- seismic/hazard data;
- CCTV catalogues;
- maritime/infrastructure layers;
- conflict and military-context layers sourced from public data;
- feed health utilities;
- same-origin /api/ci authentication boundary;
- signed-token RBAC;
- CI_VIEWER / CI_ANALYST / CI_INVESTIGATOR / CI_SUPERVISOR / CI_ADMIN roles.

Baseline tests at programme start:
- ciAuth: passing;
- integration: passing;
- layerHealth: passing;
- total focused baseline: 24/24.

## Lab target classes

### PUBLIC_OSINT
Publicly accessible sources, public datasets and public information.

Permitted initial actions:
- feed health;
- OSINT enrichment.

### S2_OWNED
Infrastructure, services and devices owned or directly controlled by S2 Tech.

Permitted initial actions:
- feed health;
- OSINT enrichment;
- passive reconnaissance;
- bounded defensive validation after authorization and approval.

### AUTHORIZED_CLIENT
A client asset where S2 has explicit authority to perform the scoped work.

Permitted initial actions:
- OSINT enrichment;
- passive reconnaissance with authorization reference;
- bounded defensive validation with authorization reference and human approval.

## Initial action classes

### FEED_HEALTH
Read-only.
Checks source availability, latency, freshness, schema drift and degradation.

### OSINT_ENRICHMENT
Read-only.
Collects and correlates approved public-source information.

### PASSIVE_RECON
Read-only/non-invasive.
Collects externally observable information without exploiting or altering the target.

### DEFENSIVE_VALIDATION
Security test.
Only S2-owned or explicitly authorized client assets.
Requires:
- authorization reference;
- human approval;
- bounded target;
- bounded method;
- run receipt.

## Hard-blocked action classes

The lab policy rejects:
- EXPLOIT;
- CREDENTIAL_ATTACK;
- PERSISTENCE;
- EVASION;
- DATA_EXFILTRATION;
- DESTRUCTIVE_ACTION;
- UNKNOWN_TARGET_ATTACK.

These are not valid Captain lab actions.

## Test ladder

### L0 Policy
Pure unit tests.
No network.

Goal:
prove that target/action/approval rules fail closed.

### L1 Synthetic intelligence
Local fixtures.

Goal:
test source confidence, correlation, incident enrichment, stale data and contradictory source handling.

### L2 Public feed smoke
Approved public endpoints only.

Goal:
measure:
- source reachability;
- response time;
- record count;
- freshness;
- schema drift;
- fallback behavior.

Existing feed audit scripts become the first L2 runner.

### L3 S2-owned passive lab
S2-owned staging endpoints/assets.

Goal:
exercise Captain -> CI -> evidence flow without touching customer targets.

### L4 Authorized client sandbox
Only after an authorization record exists.

Goal:
bounded defensive validation for an agreed client scope.

### L5 Operational read-only
Production intelligence use.

Goal:
live situational awareness and incident enrichment.
No active security validation in ordinary production operation.

## Lab request contract

Minimum request:

```json
{
  "scenarioId": "string",
  "action": "FEED_HEALTH | OSINT_ENRICHMENT | PASSIVE_RECON | DEFENSIVE_VALIDATION",
  "targetClass": "PUBLIC_OSINT | S2_OWNED | AUTHORIZED_CLIENT",
  "targetRef": "non-secret stable reference",
  "authorizationRef": "required where policy says so",
  "approved": false
}
```

Do not put credentials, access tokens or passwords in the request.

## Policy decision contract

```json
{
  "allowed": true,
  "code": "ALLOWED",
  "approvalRequired": false,
  "authorizationRequired": false,
  "privacyClass": "INTERNAL",
  "runMode": "READ_ONLY"
}
```

Fail-closed decisions return `allowed: false` with a stable reason code.

## Run receipt

Every lab execution will eventually persist:
- run ID;
- scenario ID;
- Captain skill ID/version;
- requested by;
- target class;
- target reference;
- authorization reference where required;
- requested action;
- policy decision;
- approval state;
- source/tool list;
- provider/model route;
- start/end;
- artifacts;
- result summary;
- confidence;
- errors/degraded sources;
- reviewer;
- disposition.

Secrets are never copied into the receipt.

## Captain integration

Initial Captain skills:
- ci.feed.health
- ci.osint.brief
- ci.defensive.assess

Integration sequence:
1. Captain resolves the skill.
2. S2 privacy/risk policy is applied.
3. Lab request is evaluated by CI policy.
4. Disallowed request stops before any active tool call.
5. Allowed read-only task uses approved sources/tools.
6. Defensive validation waits for authorization + human approval.
7. Result returns as structured artifact.
8. Run receipt becomes visible in Claw Studio.

## Immediate lab scenarios

LAB-001 Public feed health
- targetClass: PUBLIC_OSINT
- action: FEED_HEALTH
- expected: allowed, read-only, no approval.

LAB-002 Public OSINT brief
- targetClass: PUBLIC_OSINT
- action: OSINT_ENRICHMENT
- expected: allowed, read-only, source-labelled.

LAB-003 S2-owned passive surface inventory
- targetClass: S2_OWNED
- action: PASSIVE_RECON
- expected: allowed, read-only.

LAB-004 Unapproved active validation
- targetClass: S2_OWNED
- action: DEFENSIVE_VALIDATION
- expected: blocked until authorization and approval exist.

LAB-005 Authorized defensive validation
- targetClass: S2_OWNED or AUTHORIZED_CLIENT
- action: DEFENSIVE_VALIDATION
- expected: allowed only with authorization reference + approval.

LAB-006 Prohibited action
- action: CREDENTIAL_ATTACK (or other hard-blocked class)
- expected: policy blocked before tool execution.

## Phase gates

### Gate A
Policy tests green.

### Gate B
Public feed smoke green or degraded sources truthfully reported.

### Gate C
Captain skill manifest resolves matching CI capability/profile.

### Gate D
Authenticated Captain -> CI adapter exists.

### Gate E
Run receipts persist and are visible in Claw Studio.

### Gate F
First S2-owned passive lab run completed with evidence.

### Gate G
First explicitly authorized defensive lab run completed with approval and receipt.

## Repository governance issue

Current origin:
- fschrooge-netizen/godseye

Required S2 canonical direction:
- S2TechSecurity/godseye as origin;
- VrushankPatel/godseye as upstream.

The S2TechSecurity fork does not currently exist. Do not rewrite origin to a non-existent repository. Create/verify the organization fork first, then change origin safely.

## Production gate

Do not bind or declare ci.s2tech.co.za operational until:
- identity provider is configured;
- CI roles are verified end to end;
- Captain adapter authentication is verified;
- lab policy is server enforced;
- run receipts/audit are persisted;
- read-only operational workflows pass;
- production deployment and live QA are explicitly authorized.

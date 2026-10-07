# S2 Crime Intelligence Lab Test Matrix

Status: ACTIVE
Target: ci.s2tech.co.za/lab
Rule: required tests must pass before promotion.

| ID | Area | Test | Expected | Gate |
|---|---|---|---|---|
| LAB-POL-001 | Policy | Public feed health | Allowed read-only | Required |
| LAB-POL-002 | Policy | Public OSINT enrichment | Allowed read-only | Required |
| LAB-POL-003 | Policy | S2 passive recon | Allowed read-only | Required |
| LAB-POL-004 | Policy | Unapproved defensive validation | Blocked before tool execution | Required |
| LAB-POL-005 | Policy | Authorized defensive validation | Allowed only with authorization + approval | Required |
| LAB-POL-006 | Policy | Prohibited action | Blocked before tool execution | Required |
| LAB-SKILL-001 | Captain | Skill manifest validation | Invalid manifest rejected | Required |
| LAB-SKILL-002 | Captain | Lazy skill load | Only required skills loaded | Required |
| LAB-SKILL-003 | Captain | Routing collision | Ambiguous skill selection detected | Required |
| LAB-AGT-001 | Captain | Read-only health request | Read tools only + receipt | Required |
| LAB-AGT-002 | Captain | Disallowed tool | Block + reason + receipt | Required |
| LAB-AGT-003 | Captain | Lab write request | Lab resources only | Required |
| LAB-AGT-004 | Captain | Production-write request | Approval/policy boundary enforced | Required |
| LAB-AGT-005 | Captain | Verifier separation | Verifier cannot self-approve implementation | Required |
| LAB-AUD-001 | Audit | Correlation trace | One ID traces full workflow | Required |
| LAB-AUD-002 | Audit | Secret redaction | No raw secret in receipt/log | Required |
| LAB-AI-001 | Models | Capability route | Correct model profile selected | Required |
| LAB-AI-002 | Models | Provider fallback | Approved fallback used and recorded | Required |
| LAB-AI-003 | Models | Local/private route | Private workload stays on approved local route | Advisory |
| LAB-AI-004 | Models | Structured output | Schema-valid result | Required |
| LAB-AI-005 | Models | Prompt injection | Source text cannot override policy/tools | Required |
| LAB-FSK-001 | FSK | Valid FSK7 parse | Canonical event produced | Required |
| LAB-FSK-002 | FSK | Duplicate suppression | Single canonical event, duplicate receipt retained | Required |
| LAB-FSK-003 | FSK | Unknown code | Event retained and flagged | Required |
| LAB-FSK-004 | FSK | Unmapped account | Event retained and queued | Required |
| LAB-FSK-005 | FSK | Restore correlation | Restore links to prior alarm | Required |
| LAB-FSK-006 | FSK | Invalid/truncated frame | Rejected safely + receipt | Required |
| LAB-FSK-007 | FSK | Spool recovery | Persist then idempotent forward | Required |
| LAB-FSK-008 | FSK | Burst load | No loss, latency/queue metrics recorded | Required |
| LAB-CAM-001 | CCTV | Camera health | Correct state and latency | Required |
| LAB-CAM-002 | CCTV | Snapshot capture | Snapshot stored with timestamp/hash | Required |
| LAB-CAM-003 | CCTV | Stream failure | Failure logged, workflow survives | Required |
| LAB-CAM-004 | CCTV | Zone-camera mapping | Correct camera suggested | Required |
| LAB-VIS-001 | Vision | Object/scene extraction | Structured observation + confidence | Advisory |
| LAB-VIS-002 | Vision | Repeatability | Variation recorded within tolerance | Advisory |
| LAB-VIS-003 | Vision | Human verification | Accept/reject/amend is auditable | Required |
| LAB-EVD-001 | Evidence | Original hashing | Stable content hash | Required |
| LAB-EVD-002 | Evidence | Derived lineage | Parent/child link + hashes | Required |
| LAB-EVD-003 | Evidence | Tamper detection | Modified copy detected | Required |
| LAB-EVD-004 | Evidence | Verification state | Machine output never silently becomes verified | Required |
| LAB-OSINT-001 | OSINT | Public-source collection | URL/time/provenance retained | Required |
| LAB-OSINT-002 | OSINT | Metadata extraction | Original unchanged | Required |
| LAB-OSINT-003 | OSINT | Conflicting sources | Conflict surfaced, not flattened | Required |
| LAB-GEO-001 | Geospatial | Related cluster | Explainable cluster suggested | Advisory |
| LAB-GEO-002 | Geospatial | Negative control | Unrelated event excluded | Advisory |
| LAB-GEO-003 | Geospatial | Replay | Stored scenario reproduces same operational picture | Required |
| LAB-FAIL-001 | Platform | Primary runtime failure | Fallback available without duplicate job | Required |
| LAB-FAIL-002 | Platform | DB outage | Writes fail safely, no silent loss | Required |
| LAB-FAIL-003 | Platform | Queue/network interruption | Resume idempotently | Required |
| LAB-DEP-001 | Deployment | Lint/typecheck/test/build | Gate passes before promotion | Required |
| LAB-DEP-002 | Deployment | Post-deploy health | Health checks pass | Required |
| LAB-DEP-003 | Deployment | Rollback readiness | Known-good reference selectable/verifiable | Required |
| LAB-RBAC-001 | Security | Lab vs production role | Lab role cannot protected-write production | Required |
| LAB-SEC-001 | Security | Authorization scope | Target outside scope blocked | Required |
| LAB-SEC-002 | Security | Tool allowlist | Unapproved tool blocked | Required |
| LAB-REP-001 | Reporting | Case report | Sources/evidence/analysis/verification included | Required |
| LAB-SPATIAL-001 | Spatial R&D | Controlled 3D capture | Accuracy/storage/render metrics retained | Advisory |

## Result contract

```json
{
  "testId": "LAB-FSK-001",
  "runId": "uuid",
  "correlationId": "uuid",
  "environment": "lab",
  "fixtureVersion": "1",
  "skillVersion": "1.0.0",
  "modelRoute": null,
  "startedAt": "timestamp",
  "finishedAt": "timestamp",
  "status": "pass|fail|error|skipped",
  "expected": {},
  "actual": {},
  "metrics": {},
  "artefacts": [],
  "logs": [],
  "reviewState": "pending|approved|rejected",
  "reviewer": null
}
```

## Promotion rule

A feature may progress only when:
1. all required tests relevant to the feature pass;
2. permission and prompt-injection tests pass;
3. lint/typecheck/test/build gates pass;
4. independent verification completes;
5. deployment health passes;
6. rollback reference exists;
7. docs match actual behaviour.

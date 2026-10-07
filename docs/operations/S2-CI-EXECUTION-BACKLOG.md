# S2 Captain + CI Execution Backlog

Status: ACTIVE
Source of truth: docs/architecture/S2-CAPTAIN-CI-MASTER-IMPLEMENTATION-PLAN.md

## P0 - Baseline and control

- [ ] S2-CI-001 Canonical service/repo/domain inventory
  - Acceptance: every CI/Captain/Gateway/FSK/CCTV/Voice service has canonical repo, runtime and health source.
- [ ] S2-CI-002 Deployment ownership register
  - Acceptance: active branch, deployment source and target recorded.
- [ ] S2-CLAW-001 S2 system resolver
  - Acceptance: domain -> repo -> service -> environment -> health without guessing.
- [ ] S2-AUD-001 Universal execution receipt
  - Acceptance: correlation ID, actor, environment, skill, model route, tools, approval, result and artefacts.
- [ ] S2-PERM-001 Permission engine
  - Acceptance: read-only, lab-write, production-write, privileged and prohibited enforced before tool use.

## P0 - Captain Harness vNext

- [ ] S2-SKILL-001 Skill manifest schema
- [ ] S2-SKILL-002 Skill registry
- [ ] S2-SKILL-003 Lazy skill loader
- [ ] S2-SKILL-004 Skill Doctor metrics
- [ ] S2-TASK-001 Persisted task graph
- [ ] S2-TASK-002 Approval pause/resume
- [ ] S2-VER-001 Independent verifier contract
- [ ] S2-AI-001 Capability-based model profiles
- [ ] S2-AI-002 Provider fallback policy

Harness acceptance:
- one request resolves the required skill only;
- disallowed tools are blocked;
- selected model route is recorded;
- verifier cannot approve its own implementation;
- every completed run emits a receipt.

## P0 - CI Lab foundation

- [ ] S2-LAB-001 /lab module shell
- [ ] S2-LAB-002 lab_run schema
- [ ] S2-LAB-003 scenario registry
- [ ] S2-LAB-004 fixture registry
- [ ] S2-LAB-005 test runner API
- [ ] S2-LAB-006 expected/actual comparator
- [ ] S2-LAB-007 artefact/log references
- [ ] S2-LAB-008 review state
- [ ] S2-LAB-009 lab history/dashboard

Lab acceptance:
- lab role cannot mutate production;
- run creation/execution/review persists;
- correlation ID traces the run;
- failure is visible and retained;
- lab module is feature-switchable.

## P0 - FSK replay

- [ ] S2-FSK-LAB-001 known-good FSK7 fixture
- [ ] S2-FSK-LAB-002 duplicate fixture
- [ ] S2-FSK-LAB-003 restore fixture
- [ ] S2-FSK-LAB-004 unknown-code fixture
- [ ] S2-FSK-LAB-005 unmapped-account fixture
- [ ] S2-FSK-LAB-006 invalid/truncated fixture
- [ ] S2-FSK-LAB-007 deterministic replay runner
- [ ] S2-FSK-LAB-008 spool/network recovery test
- [ ] S2-FSK-LAB-009 burst test
- [ ] S2-FSK-LAB-010 end-to-end incident correlation

FSK acceptance:
- no silent loss;
- duplicate handling deterministic;
- unknown/unmapped retained;
- restore links correctly;
- recovery is idempotent;
- full audit trace retained.

## P1 - Case and evidence

- [ ] S2-CASE-001 Cases
- [ ] S2-EVD-001 Evidence vault
- [ ] S2-EVD-002 Original hashing
- [ ] S2-EVD-003 Derived artefact lineage
- [ ] S2-ENT-001 Entities
- [ ] S2-ENT-002 Relationships
- [ ] S2-SRC-001 Source provenance
- [ ] S2-TIME-001 Case timeline
- [ ] S2-VERSTATE-001 Verification states
- [ ] S2-REP-001 Report export

## P1 - CCTV intelligence

- [ ] S2-CAM-001 Camera registry
- [ ] S2-CAM-002 Health service
- [ ] S2-CAM-003 Zone-camera bindings
- [ ] S2-CAM-004 Snapshot service
- [ ] S2-CAM-005 Clip service
- [ ] S2-CAM-006 Media hashing
- [ ] S2-CAM-007 Vision adapter
- [ ] S2-CAM-008 Human verification

## P1 - Captain CI specialist

- [ ] ci.health
- [ ] ci.feed.health
- [ ] ci.case.create
- [ ] ci.case.summary
- [ ] ci.case.timeline
- [ ] ci.evidence.add
- [ ] ci.evidence.verify
- [ ] ci.entity.search
- [ ] ci.entity.correlate
- [ ] ci.camera.find
- [ ] ci.camera.snapshot
- [ ] ci.lab.list
- [ ] ci.lab.run
- [ ] ci.lab.compare
- [ ] ci.osint.brief
- [ ] ci.defensive.assess
- [ ] ci.report.generate

## P2 - Common operating picture

- [ ] S2-GEO-001 common spatial entity model
- [ ] S2-GEO-002 incident layer
- [ ] S2-GEO-003 camera layer
- [ ] S2-GEO-004 vehicle/tracker layer
- [ ] S2-GEO-005 drone layer
- [ ] S2-GEO-006 body-camera layer
- [ ] S2-GEO-007 case/evidence layer
- [ ] S2-GEO-008 live/replay timeline
- [ ] S2-GEO-009 confidence/verification display
- [ ] S2-GEO-010 provenance drilldown

## P2 - OSINT and defensive lab

- [ ] S2-OSINT-001 approved source registry
- [ ] S2-OSINT-002 source capture/provenance
- [ ] S2-OSINT-003 metadata extraction
- [ ] S2-OSINT-004 passive surface inventory
- [ ] S2-SEC-001 target authorization records
- [ ] S2-SEC-002 tool allowlist
- [ ] S2-SEC-003 bounded defensive validation
- [ ] S2-SEC-004 hard-block policy tests
- [ ] S2-SEC-005 artefact hashing and review

## P2 - Model lab

- [ ] S2-MODEL-001 benchmark fixture set
- [ ] S2-MODEL-002 extraction benchmark
- [ ] S2-MODEL-003 coding benchmark
- [ ] S2-MODEL-004 vision benchmark
- [ ] S2-MODEL-005 routing benchmark
- [ ] S2-MODEL-006 prompt-injection benchmark
- [ ] S2-MODEL-007 local/private benchmark
- [ ] S2-MODEL-008 provider-outage/fallback test

## P2 - Multi-agent engineering

- [ ] S2-AGENT-001 worktree manager
- [ ] S2-AGENT-002 implementer role
- [ ] S2-AGENT-003 tester role
- [ ] S2-AGENT-004 reviewer role
- [ ] S2-AGENT-005 docs role
- [ ] S2-AGENT-006 impact analysis
- [ ] S2-AGENT-007 merge gate
- [ ] S2-AGENT-008 deploy health gate
- [ ] S2-AGENT-009 rollback reference
- [ ] S2-AGENT-010 change receipt

## P3 - Optional capability packs

- [ ] commercial research pack
- [ ] media/content pack
- [ ] website delivery pack
- [ ] voice-to-Captain jobs
- [ ] spatial/Gaussian-splat R&D
- [ ] drone live adapter
- [ ] body-camera live adapter
- [ ] tracker adapter
- [ ] additional alarm receivers

## Milestone gates

### M1 - Captain can run the lab
Required:
- P0 harness minimum;
- lab shell;
- FSK replay;
- receipts;
- Captain health + lab adapter;
- Claw Studio job/receipt visibility.

### M2 - Captain can assist an incident
Required:
- case/evidence/provenance;
- camera health/snapshot;
- human verification;
- report draft.

### M3 - CI is a common operating picture
Required:
- map/timeline common model;
- correlation;
- OSINT lab;
- model lab;
- live/replay.

### M4 - Captain is S2 work orchestration
Required:
- multi-agent development flow;
- optional service packs;
- broader S2 connectors;
- controlled scheduled jobs.

# S2 Captain + Crime Intelligence Integration Master Plan

Status: ACTIVE  
Date: 2026-10-07  
Canonical CI repository: D:\dev\godseye  
Operational target: https://ci.s2tech.co.za  
Control plane: Captain / OpenClaw / Claw Studio  
Primary rule: Lab first, evidence first, no silent production mutation.

## 1. Objective

Turn Captain into the operating interface for S2 systems and turn ci.s2tech.co.za into the operational crime-intelligence and lab surface where new intelligence, automation, geospatial, media, defensive-security and agent capabilities are tested before production use.

The programme must produce usable capability in every phase. No phase exists only to make architecture diagrams.

The target outcome is:

- Captain understands S2 systems, projects, services and permissions.
- Claw Studio shows active jobs, approvals, evidence, receipts and failures.
- CI provides one crime-intelligence operating picture and one controlled lab.
- S2 AI Gateway selects models by capability, privacy, cost and availability.
- Skills are versioned, tested and loaded only when needed.
- Every consequential action produces a reproducible execution receipt.
- New integrations enter through fixtures and replay before live use.
- Defensive security testing is bounded to S2-owned or explicitly authorized targets.
- Production deployment remains gated by tests, independent verification and health checks.

## 2. Architecture decision

S2 will not adopt another vendor or open-source AI platform as the new system of record.

Captain remains the control plane.

External projects such as ECC, Claude Skills, Hermes plugins, StarNet, Dify, OpenManus, Workspace Studio, local-model routers and similar tools are reference implementations or optional adapters.

We adopt patterns, not platform lock-in.

### Target stack

```text
Users / Voice / S2 Apps / Events / Scheduled Jobs
                         |
                     Claw Studio
                         |
                    CAPTAIN CORE
        intent -> plan -> risk -> route -> verify
                         |
             +-----------+-----------+
             |                       |
        Skill Registry          Task Graph
             |                       |
             +-----------+-----------+
                         |
                    S2 AI Gateway
       reasoning / coding / vision / local / cheap
                         |
          Connectors / APIs / MCP / DB / queues
                         |
             S2 services and data sources
                         |
          Audit / receipts / evidence / metrics
```

## 3. Non-negotiable design rules

1. Model names are never hard-coded into business workflows.
2. Every skill has a manifest, version, permission class and tests.
3. Read-only is the default.
4. Lab-write and production-write are separate permission classes.
5. Production-changing actions require an explicit policy decision.
6. Secrets never appear in prompts, source control or run receipts.
7. Browser/UI automation is not an S2 execution path.
8. Stable logic moves into code instead of growing prompts forever.
9. Large context is retrieved on demand instead of preloaded.
10. Every new data source has health, provenance, fixtures, replay and failure tests.
11. Every agent task has an owner, correlation ID and persisted status.
12. No two implementation agents share one dirty working tree.
13. Failed verification blocks promotion.
14. Production failures must have a known-good rollback reference.
15. CI lab never becomes an unrestricted offensive-security environment.

## 4. Capability model

### 4.1 Captain Core

Captain Core is responsible for:

- intent classification;
- system resolution;
- task decomposition;
- risk classification;
- skill selection;
- model profile selection;
- permission enforcement;
- task graph execution;
- approval pauses;
- result verification;
- execution receipts.

Captain does not directly contain every integration. It calls versioned skills and adapters.

### 4.2 Skill Registry

Every S2 skill must have at minimum:

```yaml
id: ci.case.summary
version: 1.0.0
owner: s2-intelligence
purpose: Produce a sourced case summary
inputs: {}
outputs: {}
permissions:
  class: read-only
tools: []
modelProfile: reasoning.standard
privacy: internal
risk: low
dependencies: []
tests: []
lastValidated: 2026-10-07
```

Required skill classes:

- utility skill: one bounded operation;
- orchestration skill: coordinates multiple utilities;
- policy skill: evaluates permission/risk;
- verifier skill: checks another worker's output;
- adapter skill: translates an external service into S2 contracts.

### 4.3 Skill Doctor

Captain must maintain metrics for:

- invocation count;
- success/failure rate;
- median latency;
- token/model cost where applicable;
- last validated date;
- dependency health;
- permission violations;
- stale prompt/instruction warnings;
- test coverage;
- routing collisions.

Unused or failing skills are quarantined rather than silently remaining available.

### 4.4 Task Graph

Jobs must support:

- parent/child tasks;
- dependency edges;
- parallel execution;
- retries;
- timeout state;
- approval state;
- artefact references;
- independent verifier;
- cancel state;
- resumable state where safe.

### 4.5 Model routing

Workflows request a capability profile rather than a vendor model.

Initial profiles:

- reasoning.high
- reasoning.standard
- coding.high
- coding.fast
- extraction.cheap
- vision.standard
- research.web
- local.private
- long-context

Gateway policy evaluates:

- quality requirement;
- data classification;
- local-only requirement;
- provider health;
- quota;
- latency;
- cost;
- fallback eligibility.

## 5. Crime Intelligence platform role

ci.s2tech.co.za becomes the operational intelligence surface, not merely a map.

Core domains:

- cases;
- evidence;
- entities;
- relationships;
- incidents;
- sources;
- provenance;
- watchlists;
- alerts;
- cameras;
- FSK events;
- vehicle/tracker observations;
- drone observations;
- body-camera observations;
- geospatial layers;
- public OSINT;
- lab runs;
- reports.

Every observation must preserve:

- source;
- observed time;
- ingestion time;
- location where relevant;
- confidence;
- verification state;
- lineage;
- related artefacts;
- correlation ID.

## 6. Lab model

The lab is a first-class CI module at /lab.

Test ladder:

- L0: policy and unit tests, no network.
- L1: synthetic fixtures and deterministic replay.
- L2: approved public feed smoke tests.
- L3: S2-owned passive lab.
- L4: explicitly authorized client defensive sandbox.
- L5: operational read-only production intelligence.

Allowed initial actions:

- FEED_HEALTH
- OSINT_ENRICHMENT
- PASSIVE_RECON
- DEFENSIVE_VALIDATION with authorization and approval

Hard-blocked action classes:

- EXPLOIT
- CREDENTIAL_ATTACK
- PERSISTENCE
- EVASION
- DATA_EXFILTRATION
- DESTRUCTIVE_ACTION
- UNKNOWN_TARGET_ATTACK

The policy engine must fail closed before any tool is invoked.

## 7. Phase 0: Freeze the truth

Goal: establish one factual baseline before adding capability.

Deliverables:

- canonical repository/service/domain inventory;
- Captain/Claw/AI Gateway/CI/FSK/CCTV/Voice ownership map;
- active branches and deploy sources;
- duplicate/legacy implementation register;
- current health endpoints;
- current CI roles and auth path;
- existing lab tests recorded;
- production vs lab dependency map.

Usable result:

Captain can answer read-only questions such as:
- what service owns ci.s2tech.co.za?
- what branch is under test?
- what is unhealthy?
- which repo owns this route?
- what tests currently fail?

Exit gate:

- inventory documented;
- no guessed ownership;
- current CI focused tests remain green;
- no production change required.

## 8. Phase 1: Captain Harness vNext

Goal: make Captain predictable before giving it more power.

Build:

- skill manifest schema;
- skill registry;
- lazy skill loading;
- risk classes;
- permission classes;
- execution receipt schema;
- correlation IDs;
- task graph state model;
- independent verifier contract;
- capability-based model routing contract.

Initial permission classes:

- read-only
- lab-write
- production-write
- privileged
- prohibited

Initial specialist profiles:

- Researcher
- Architect
- Builder
- Tester
- Security Reviewer
- Operations
- Commercial Research
- Media/Content

Usable result:

Captain can receive a task, resolve skills, classify risk, select a model profile, execute read-only work and return a receipt.

Exit gate:

- skill schema validated;
- permission denial tests pass;
- receipts persist;
- verifier cannot approve its own implementation;
- gateway route is recorded.

## 9. Phase 2: CI Lab shell

Goal: make lab work visible and repeatable.

Build:

- /lab route;
- lab_run schema;
- scenario registry;
- fixture registry;
- expected vs actual results;
- artefact storage references;
- logs;
- reviewer state;
- pass/fail/error/skipped states;
- subsystem filters;
- run receipts.

Usable result:

An operator can create a lab run, execute it, inspect artefacts, review the result and retain the record.

Exit gate:

- lab role cannot mutate production;
- every run has correlation ID;
- missing/failed tools are visible;
- lab module can be disabled;
- test result history persists.

## 10. Phase 3: FSK replay and alarm intelligence

Goal: connect the lab to an S2 operational signal source without touching live receiver behavior.

Fixtures:

- valid FSK7 event;
- duplicate inside dedupe window;
- restore event;
- unknown code;
- unmapped account;
- truncated/invalid frame;
- network interruption;
- burst load.

Pipeline:

fixture -> replay runner -> canonical ingest -> mapping -> CI observation -> incident correlation -> camera suggestion -> receipt.

Usable result:

Captain can run:
`ci.lab.run fsk-basic`
and return exactly what parsed, mapped, correlated and failed.

Exit gate:

- zero silent event loss;
- duplicate behavior verified;
- unknown/unmapped retained;
- restore correlation verified;
- spool recovery idempotent;
- full correlation trace available.

## 11. Phase 4: Evidence and case foundation

Goal: make CI outputs evidentially useful instead of disposable AI answers.

Build:

- case records;
- evidence records;
- SHA-256 or stronger content hash;
- immutable original reference;
- derived artefact lineage;
- entity links;
- source provenance;
- verification states;
- analyst notes;
- timeline;
- report export.

Verification states:

- unverified
- machine-observed
- analyst-reviewed
- corroborated
- rejected
- superseded

Usable result:

Captain can create a draft case, attach lab evidence, summarize a timeline and produce a sourced draft report without claiming machine output is verified fact.

Exit gate:

- original artefact hash stable;
- modified copy detected;
- derived artefact linked to parent;
- human review captured;
- export includes provenance and verification state.

## 12. Phase 5: CCTV intelligence

Goal: connect authorised camera intelligence to incidents.

Build:

- camera registry;
- provider/connection metadata;
- camera health;
- site/zone/camera bindings;
- snapshot request;
- bounded clip request;
- media hashing;
- media observation;
- vision adapter;
- human verification workflow.

Required behaviour:

- unavailable streams do not crash incidents;
- analysis records model/version;
- machine observations remain unverified until reviewed;
- credentials remain outside CI evidence records;
- client feeds are accessed only through approved S2 integration paths.

Usable result:

For a test incident, Captain can identify relevant cameras, request approved media, attach artefacts and draft observations.

Exit gate:

- camera health test green;
- snapshot test green;
- failure path green;
- zone mapping green;
- vision result carries confidence and model metadata.

## 13. Phase 6: Godseye common operating picture

Goal: unify intelligence sources on one spatial and temporal surface.

Add common map entities for:

- incidents;
- FSK events;
- cameras;
- vehicles;
- trackers;
- drone observations;
- body-camera observations;
- cases;
- evidence;
- watchlists;
- public intelligence sources;
- hotspots.

Required UI concepts:

- live mode;
- replay mode;
- timeline scrubber;
- confidence state;
- verification state;
- source freshness;
- provenance drilldown;
- related-entity selection;
- degraded feed state.

Usable result:

One map and timeline can reconstruct a lab incident from signal through evidence and analyst disposition.

Exit gate:

- common map model used by all new S2 layers;
- provenance visible;
- stale data visible;
- replay deterministic from stored test data.

## 14. Phase 7: Captain CI specialist

Goal: let operators use CI conversationally without bypassing controls.

Initial skills:

- ci.health
- ci.feed.health
- ci.case.create
- ci.case.summary
- ci.case.timeline
- ci.evidence.add
- ci.evidence.verify
- ci.entity.search
- ci.entity.correlate
- ci.camera.find
- ci.camera.snapshot
- ci.lab.list
- ci.lab.run
- ci.lab.compare
- ci.alert.explain
- ci.report.generate
- ci.osint.brief
- ci.defensive.assess

Example safe operator request:

```text
Captain, show me all events linked to account 33089 from the last hour,
identify the mapped cameras, collect available approved snapshots, explain
anything unusual, and prepare a draft incident summary. Do not dispatch,
contact anyone, or change production state.
```

Expected behaviour:

1. Resolve account/site context.
2. Classify as read-only unless a requested tool changes state.
3. Load only required CI skills.
4. Query approved services.
5. Record provenance.
6. Mark machine analysis unverified.
7. Return summary and receipt.
8. Stop at any permission boundary.

Exit gate:

- all initial skills have manifests and tests;
- read-only requests execute end to end;
- disallowed action blocked before tool call;
- run visible in Claw Studio.

## 15. Phase 8: Multi-agent engineering harness

Goal: make Claw useful for building S2 systems safely.

Adopt the useful ECC/G-Stack pattern:

idea -> research -> specification -> architecture -> implementation -> tests -> security review -> build -> deployment gate -> production verification -> reflection.

Build:

- isolated Git worktree per task;
- implementer role;
- test role;
- reviewer role;
- docs role;
- dependency impact analysis;
- structured handoff;
- merge gate;
- deployment health gate;
- rollback reference;
- change receipt.

Usable result:

Captain can take a bounded development task from plan to verified candidate change without agents editing the same working tree.

Exit gate:

- independent verifier receives diff and test evidence;
- lint/typecheck/test/build evidence is retained;
- failure blocks merge/promotion;
- project documentation updated before close.

## 16. Phase 9: Model and local-compute lab

Goal: prove which models actually fit S2 workloads.

Do not benchmark generic chat alone.

Benchmark tasks:

- event extraction;
- FSK classification;
- case summarization;
- code review;
- code generation;
- image observation;
- OCR only where necessary;
- geospatial reasoning;
- tool routing;
- prompt-injection resistance;
- structured JSON adherence.

Record:

- model identifier;
- provider/runtime;
- hardware;
- prompt version;
- latency;
- memory/VRAM;
- output validity;
- task score;
- cost;
- privacy class;
- failure mode.

Local candidates are admitted only if they beat an existing route on at least one useful dimension such as cost, privacy, speed or reliability.

Usable result:

S2 AI Gateway has evidence-backed routing rules rather than model hype.

Exit gate:

- baseline model set tested;
- fallback tested;
- local route tested;
- provider outage simulated;
- routing receipt visible.

## 17. Phase 10: OSINT and defensive-security lab

Goal: make ci.s2tech.co.za useful for authorized intelligence and defensive validation.

Permitted initial capabilities:

- public-source search;
- source archiving;
- metadata extraction;
- passive surface inventory;
- certificate/DNS/service metadata for authorized scope;
- security-header/configuration checks;
- dependency/advisory review;
- bounded defensive validation on S2-owned or explicitly authorized client assets.

Every target requires:

- target class;
- stable target reference;
- authorization reference where required;
- allowed action class;
- scope boundary;
- start/end;
- artefact destination.

No autonomous escalation from passive analysis into active testing.

Usable result:

Captain can run a logged, bounded S2-owned assessment and place resulting artefacts into the correct CI case.

Exit gate:

- hard-blocked action tests pass;
- authorization checks pass;
- tool allowlist enforced;
- artefacts hashed;
- analyst review possible;
- audit receipt complete.

## 18. Phase 11: Commercial and media capability packs

Goal: turn useful research-pack ideas into switchable S2 services without bloating Captain Core.

Candidate packs:

### Commercial Research
- prospect discovery;
- public company research;
- qualification;
- proposal preparation;
- CRM handoff;
- follow-up drafting.

### Media
- image generation adapters;
- local image enhancement;
- voice generation;
- long-video clipping;
- presentation generation;
- marketing asset preparation.

### Website Delivery
- project intake;
- design brief;
- repository bootstrap;
- implementation;
- test/build;
- deployment candidate;
- iteration loop.

Rules:

- packs are optional;
- every pack has independent permissions;
- no mass plugin installation;
- every third-party dependency has provenance and review status.

## 19. Phase 12: Spatial intelligence R&D

Goal: evaluate Gaussian splatting / open 3D capture for future CI use.

Potential applications:

- scene reconstruction;
- property/site intelligence;
- post-incident reconstruction;
- drone mapping;
- fixed-site capture;
- training environments;
- route planning;
- evidence visualization.

Lab only until storage, provenance, accuracy and privacy questions are answered.

Required experiments:

- controlled S2 site capture;
- known-distance accuracy check;
- file-size/compression comparison;
- browser rendering performance;
- Cesium compatibility;
- lineage/evidence treatment;
- change-over-time comparison.

## 20. Claw Studio requirements

Claw Studio must expose:

- active jobs;
- queued jobs;
- task graph;
- current worker/role;
- skill/version;
- model route;
- permission class;
- requested approvals;
- logs;
- artefacts;
- test evidence;
- verifier outcome;
- deployment state;
- correlation ID;
- retry/cancel where safe;
- final receipt.

This is the control surface. Do not add a second competing AI-operations UI unless a capability cannot reasonably be integrated.

## 21. Universal execution receipt

Minimum receipt:

```json
{
  "correlationId": "uuid",
  "parentCorrelationId": null,
  "actor": "user-or-service",
  "environment": "lab",
  "service": "ci",
  "action": "ci.lab.run",
  "target": "fsk-basic",
  "skill": {"id": "ci.lab.run", "version": "1.0.0"},
  "modelRoute": {"profile": "reasoning.standard", "resolved": "provider/model"},
  "tools": [],
  "permissionClass": "lab-write",
  "approval": {"required": false, "state": "not-required"},
  "startedAt": "timestamp",
  "finishedAt": "timestamp",
  "result": "success",
  "errors": [],
  "artefacts": [],
  "tests": [],
  "verifier": null
}
```

Receipts must never contain raw secrets.

## 22. Promotion gates

A feature can move toward production only when:

1. required lab tests pass;
2. permission tests pass;
3. build gates pass;
4. independent verification passes;
5. required security checks pass;
6. deployment health checks pass;
7. rollback reference exists;
8. docs match deployed behaviour;
9. outstanding degraded dependencies are explicitly recorded.

No "looks good" promotion.

## 23. First usable milestone

Milestone M1 is complete when:

- /lab exists and is access controlled;
- lab runs persist;
- FSK fixtures can replay without touching live receiver paths;
- expected vs actual results are visible;
- execution receipts exist;
- Captain can query CI health;
- Captain can list lab scenarios;
- Captain can start an approved lab run;
- Captain can read the result;
- Claw Studio can display the job/receipt;
- build/test gates are green.

At M1, S2 has a real measurable Captain -> CI workflow.

## 24. Milestone M2

M2 adds:

- cases;
- evidence;
- provenance;
- timeline;
- camera registry;
- camera health;
- approved snapshots;
- machine observation;
- human verification.

At M2, Captain can assist with a real incident workflow while staying inside read-only/approved boundaries.

## 25. Milestone M3

M3 adds:

- common operating picture;
- entity correlation;
- tracker/vehicle/drone interfaces;
- OSINT lab workflows;
- model benchmark lab;
- source confidence;
- replay mode.

At M3, CI becomes an operational intelligence platform rather than a Godseye fork with S2 branding.

## 26. Milestone M4

M4 adds:

- multi-agent engineering workflow;
- commercial research pack;
- media pack;
- website delivery pack;
- broader S2 application connectors;
- controlled scheduled jobs.

At M4, Captain becomes the primary S2 work orchestration surface.

## 27. Immediate execution order

Do these in order:

1. Consolidate CI planning documents into D:\dev\godseye.
2. Baseline current CI tests, branch and deployment relationship.
3. Create skill manifest and permission schema.
4. Create execution receipt schema.
5. Create lab_run and scenario schemas.
6. Implement /lab shell.
7. Import versioned FSK fixtures.
8. Build deterministic FSK replay runner.
9. Persist expected/actual test output.
10. Add Captain read-only CI adapter.
11. Add Captain lab-run adapter.
12. Expose receipts in Claw Studio.
13. Run first end-to-end replay.
14. Fix failures until repeatable.
15. Only then connect the next live source.

## 28. Explicitly deferred

Do not let these distract M1:

- mass Hermes/plugin installation;
- autonomous stock trading;
- autonomous active security testing;
- replacing Captain with Dify/OpenManus/StarNet/Gemini Enterprise;
- production drone/body-camera ingestion before replay contracts exist;
- expensive model subscriptions before routing benchmarks justify them;
- visual polish that does not improve lab/operator function.

## 29. Definition of programme success

This programme succeeds when an authorized S2 operator can ask Captain a real operational question, Captain can resolve the correct S2 systems and permissions, execute a measurable workflow, collect evidence with provenance, show what it did in Claw Studio, and return an answer that can be independently verified.

The lab exists so new capability reaches that standard before production.


## Cross-programme Captain alignment - 2026-10-07

Shared Captain contracts are coordinated from:
D:\dev\S2-Voice\docs\S2-CAPTAIN-CROSS-PROGRAM-ALIGNMENT.md

CI ownership remains inside Godseye:
- CI lab
- cases/evidence
- intelligence entities/relationships
- feeds
- FSK replay/intelligence
- CCTV/vision observations
- geospatial/timeline
- defensive-security lab policy

Acquisition remains the commercial source of truth and must not reuse CI surveillance/intelligence data for commercial prospecting merely because Captain can access both domains.

The common skill-manifest, permission-class, execution-receipt, task-state and health-state contracts must remain compatible with Captain/Claw Studio.

Free/trial provider capacity uses the same fail-closed rule as CI degraded feeds: a dependency may degrade or become ineligible without causing the system to lie about its state or silently move to paid capacity.

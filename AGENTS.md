# S2 Crime Intelligence Agent Rules

All agents working in this repository must follow these rules.

## Source of truth

Read these before implementation:

1. docs/architecture/S2-CAPTAIN-CI-MASTER-IMPLEMENTATION-PLAN.md
2. docs/operations/S2-CI-EXECUTION-BACKLOG.md
3. docs/lab/S2-CI-LAB-TEST-MATRIX.md
4. docs/S2-CI-LAB-PLAN.md
5. docs/CI-AUTHENTICATION.md

If code and docs disagree, stop promotion and reconcile the discrepancy.

## Working rules

- Work only in the canonical repository: D:\dev\godseye.
- One implementation task per isolated worktree.
- Never share a dirty worktree between agents.
- Do not perform production-changing work from lab tasks.
- Read-only is the default permission class.
- Do not use browser/UI automation as an execution path.
- Do not put secrets in prompts, source files, fixtures, logs or receipts.
- Do not fabricate test/build/deployment results.
- Every new integration needs health, provenance, fixture, replay/failure test and permission class.
- Machine analysis is not verified evidence until human review where required.
- Preserve originals and link derived evidence through hashes/lineage.
- Defensive testing is limited to S2-owned or explicitly authorized targets and bounded approved actions.
- Prohibited action classes in docs/S2-CI-LAB-PLAN.md must fail closed.
- Database/schema evolution must be additive and non-destructive.
- New features must be modular/disableable.
- Model routing must use capability profiles, not hard-coded provider names in business logic.

## Required close-out evidence

For a completed engineering task, report:

- files changed;
- tests run;
- test results;
- lint result;
- typecheck result;
- build result;
- security/policy checks where relevant;
- migration status where relevant;
- deployment status if deployment was in scope;
- rollback reference if production changed;
- documentation updated;
- unresolved risks.

## Promotion rule

No feature is production-ready merely because it works locally.

Required gates are defined in docs/lab/S2-CI-LAB-TEST-MATRIX.md and the master implementation plan.

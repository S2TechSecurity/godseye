# S2 CI Lab Baseline - 2026-10-07

Status: STARTED
Repository: D:\dev\godseye
Branch: feature/ci-captain-lab

## Purpose

Record the first verified baseline for the Captain + CI lab programme.

## Policy/auth/integration baseline

Command:

`npm run lab:ci`

Result:

- Test files: 4 passed
- Tests: 40 passed
- ciLabPolicy: 16 passed
- ciAuth: 8 passed
- layerHealth: 14 passed
- integration: 2 passed

The lab runner was changed to use one Vitest worker because the default parallel run hung without reporting results in the remote execution environment.

Current deterministic command:

`vitest run ... --maxWorkers=1 --minWorkers=1`

## Public feed baseline

Command:

`npm run lab:ci:public`

Overall result:

`PASS_DEGRADED`

Observed metrics on the combined run:

- ADSB_LOL_GLOBAL: 5960
- OPENSKY_GLOBAL: 6231
- USGS_ALL_DAY: 283
- GLOBAL_PORTS_LIVE: 2951
- SATELLITE_MANIFEST_RECORDS: 15632
- MARITIME_PORTS_MANIFEST_RECORDS: 2951
- CELESTRAK_ACTIVE_RECORDS: 0 on the combined run

Source state:

- ADSB_LOL: LIVE, HTTP 200
- OPENSKY: LIVE, HTTP 200
- USGS: LIVE, HTTP 200
- GLOBAL_PORTS: LIVE, HTTP 200
- CELESTRAK: DEGRADED, HTTP 403 on the combined run

Important observation:

CelesTrak was HTTP 200 and returned approximately 15,950 records in the immediately preceding standalone feed run, then returned HTTP 403 on the combined run. The lab correctly reported the source as degraded while the stored satellite manifest still provided 15,632 records, so the satellite coverage gate remained available.

This is exactly the behaviour the CI platform needs: expose source degradation instead of turning a transient third-party failure into a complete platform failure.

## Current verified capabilities

Verified today:

- policy fail-closed behaviour;
- public feed read-only allowance;
- authorization requirement for defensive validation;
- human approval requirement for defensive validation;
- hard blocking of prohibited action classes;
- bounded run receipt construction;
- signed CI role acceptance/rejection;
- layer-health utilities;
- integration parsing tests;
- public feed health and fallback behaviour.

## Not yet implemented

The following remain programme work:

- persisted lab_run records;
- /lab operator surface;
- Captain skill registry;
- task graph persistence;
- execution receipt persistence;
- FSK replay fixtures and runner;
- case/evidence vault;
- camera lab integration;
- Claw Studio run visibility;
- model benchmark lab;
- OSINT/defensive run artefact handling.

## Next test target

The next concrete lab milestone is deterministic FSK replay.

Required first fixture set:

1. known-good FSK7 event;
2. duplicate inside dedupe window;
3. restore event;
4. unknown code;
5. unmapped account;
6. invalid/truncated frame.

Success means the replay can run without touching the live receiver path and can produce expected-vs-actual results plus a correlation receipt.

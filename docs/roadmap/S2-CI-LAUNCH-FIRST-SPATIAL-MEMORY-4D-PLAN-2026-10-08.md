# S² Tech CI: Launch-First Programme and Deferred Spatial Memory / 4D Integration Plan

**Document ID:** S2-CI-ROADMAP-4D-20261008  
**Version:** 1.0 (implementation-ready planning, NOT an implementation release)  
**Date:** 2026-10-08 (Africa/Johannesburg)  
**Owner:** S² Tech Security / S² Intelligence  
**Canonical repository:** `D:\dev\godseye` / `S2TechSecurity/godseye`  
**Target production address:** `https://ci.s2tech.co.za` (letter i, not numeral 1)  
**Status:** 4D integration **DEFERRED / feature flag OFF**. Main CI platform is the current release priority.  
**Source:** Bilawal Sidhu, *I Built a God’s Eye View of Time. The Internet Went Wild.* Transcript provided by project owner, 2026-10-08. Official upstream reference: https://github.com/bilawalsidhu/gods-eye-view  
**Related authoritative files:** `docs/architecture/S2-CAPTAIN-CI-MASTER-IMPLEMENTATION-PLAN.md`, `docs/operations/S2-CI-EXECUTION-BACKLOG.md`, `docs/lab/S2-CI-LAB-TEST-MATRIX.md`, `docs/CI-AUTHENTICATION.md`, `AGENTS.md`.

> **Controlling decision:** Do **not** let spatial reconstruction delay login, a healthy deployment, the current common operating picture, protected CI APIs or core incident workflows. Do not deploy this roadmap branch. Implement only after the gates below have recorded evidence.

---

## A. Evidence-based platform status at plan creation

### A1. Reachability and hosting checks

Measurements taken from S2Tech1 and a second S² computer on 2026-10-08; they are **point-in-time**, not continuous monitoring.

| Probe | c1.s2tech.co.za (numeral 1) | ci.s2tech.co.za (letter i) |
|---|---|---|
| A-record | 197.242.144.174 | 41.76.208.103 |
| Destination | Different host from known dedicated server | S² dedicated server address |
| Strict TLS | Certificate hostname mismatch | Untrusted certificate chain |
| HTTPS response with certificate checking disabled for diagnosis only | 200, Apache | 503, Service Unavailable |
| Inference | Some website serves here, identity of intended CI application **unverified** | Reverse-proxy/host responds; CI application is **not available** through the public HTTPS route |

Root cause of `503` is **NOT** yet confirmed: possibilities include missing Coolify service, unhealthy upstream, invalid proxy target, inaccessible internal port, or mismatch between configured Docker domain and app. No claim of server-side root cause is justified until Coolify routes/container health/logs are inspected. Nonvalidated TLS must never be accepted for login.

### A2. Source and lab baseline

- S2Tech1 has canonical `D:\dev\godseye` checked out at `feature/ci-captain-lab`, HEAD `7e1a482b13bbebb23bb08733990812101cf0ba4b` (2026-10-07).
- `origin` is `S2TechSecurity/godseye`; upstream is `VrushankPatel/godseye`.
- Working tree contains a pre-existing local `.gitignore` modification; preserve it untouched.
- Separate repository branches exist: `feature/ci-portal-shell`, `feature/ci-auth-rbac`, `feature/ci-captain-lab`. `production` currently resolves to the older upstream baseline `bd982bc`; it is **not** an integration-ready promotion source.
- Direct S2Tech1 test run `npm run lab:ci`: **40 passed / 40**, exit code 0 (4 files, 2026-10-08). These are focused policy, CI auth, integration parsing and feed-health tests, **not** a full production validation.
- Existing project baseline documentation lists missing persisted lab runs, `/lab` operator UI, Captain skill registry, receipt persistence, FSK replay harness, evidence vault, camera lab integration and Claw Studio run visibility.
- The current authentication documentation says the OIDC-compatible identity provider is **not yet configured** in the repository. Protected API and login flow cannot be assumed operational.
- SSH diagnostic session from S2Tech1 to alias `dedicated` exited 255 during this review; therefore Coolify/container internals were **not verified** in this review.

### A3. Readiness verdict and meaning of “online”

**Status: BLOCKED.** The repository has useful existing components, but `ci.s2tech.co.za` is not a proven working, authenticated production service. A 40/40 unit test result is not a deployment.

Do not publish a progress percentage based on file count or branch count. Use the staged release gates in section B.

---

## B. FIRST PRIORITY: Get the existing CI platform useful and online

**Definition of minimum usable CI release (M0):** Authorized S² administrator can securely open `https://ci.s2tech.co.za`, authenticate, see the existing Cesium Godseye map and permitted public feed layers, inspect feed health, and log out; all protected server endpoints enforce roles. No Captain autonomy, active alarms, remote arm/disarm, customer footage, facial identification, or 4D reconstruction is necessary for this first milestone. Keep lab/advanced modules disabled until individually verified.

### B1. Immediate read-only infrastructure diagnosis, in order

1. Identify the actual Coolify application for `ci.s2tech.co.za`, its deployed image/tag/commit, configured domain, ports, internal service name, health check and environment. Capture a redacted operator receipt. Avoid printing secrets.
2. Read container status, restart counts, recent application error logs and reverse-proxy routing errors. Establish which component returned the HTTP 503.
3. Check host Docker network memberships, upstream app port, binding to 0.0.0.0 *inside* the container, and service availability from the reverse proxy. Diagnose rather than restart blindly.
4. Confirm Coolify is deploying from `S2TechSecurity/godseye` and an S²-owned, reviewed branch. The existing `production` branch is behind feature branches and must **not** be promoted without integration and tests.
5. Validate the correct hostname `ci.s2tech.co.za`, DNS, certificate issuer/chain, certificate hostname coverage, SNI, HTTPS redirect, and renewals. Obtain proper publicly trusted TLS. Do not bypass verification in production.
6. Leave `c1.s2tech.co.za` unchanged pending an explicit DNS ownership decision; it currently points to a different IP and is not established as the CI production address.
7. Record all read-only findings in the operations backlog, including owner, blocker, and observed timestamp.

### B2. Release candidate construction

- Create a dedicated integration worktree based on the reviewed CI portal/auth/lab branches; protect the existing dirty checkout.
- Inventory differences and cherry-pick or merge only compatible commits. Resolve conflicts manually; no force push, no overwrite of data or secrets.
- Retire Vercel-only runtime assumptions for the Coolify deployment path while preserving compatible application code. In particular, audit `api/ci/*` serverless endpoints and create equivalent server-side routes in the dedicated runtime; do not expose browser tokens or sign JWTs in frontend code.
- Define explicit `/health` (process) and `/ready` (dependency readiness) endpoints with observable, secret-free health output. Prefer returning `503` honestly on unready dependencies rather than masking failures.
- Configure a chosen S²-controlled OIDC/JWKS identity provider, proper `CI_AUTH_ISSUER`, `CI_AUTH_AUDIENCE`, `CI_AUTH_JWKS_URL` secrets server-side, TLS, allowed origins, and session expiry. No default or hard-coded shared administrator password.
- Validate `CI_ADMIN`, `CI_SUPERVISOR`, `CI_INVESTIGATOR`, `CI_ANALYST`, `CI_VIEWER`: login, unauthenticated denial, least-privilege behavior, logout, and password-reset path if offered.
- Apply per-module feature flags: `ci.portal` ON after review; `ci.lab`, `ci.captain`, `ci.customer_camera`, `ci.remote_control`, `ci.spatial_memory` OFF until their gates pass.
- Check external source license and terms. The MIT frontend license does **not** imply commercial rights for third-party imagery, feeds, tiles, recordings, or images.
- Run `npm run env:check`, lint, typecheck, focused and broader tests, build, deployment smoke checks, and targeted policy/RBAC checks. Capture actual outputs; do not reuse old results as current proof.

### B3. Staged release and promotion criteria

| Gate | Purpose | Evidence required | Can production proceed? |
|---|---|---|---|
| G0 | DNS, correct Coolify route, application starts | DNS + upstream health + HTTP response + trusted TLS | NO until passed |
| G1 | Secure administrator entry | Real admin login/logout, JWKS validation, deny tests, server-side roles | NO until passed |
| G2 | Map and approved public feeds | Cesium loads, feed health + freshness visible, stale/offline stated | M0 pilot eligible |
| G3 | Persistent lab/FSK replay | /lab RBAC, fixture runs, receipts, idempotent replay detached from live FSK | M1 only |
| G4 | Cases, evidence, camera metadata | Persistent case/evidence, camera health + snapshot, human review | M2 only |
| G5 | Incident geospatial replay | Deterministic case replay, source provenance, redaction, map timeline | M3 only |

M0 is a **narrow authorized internal pilot**, not a declaration that the full CI programme is complete. If existing repository governance requires stricter promotion checks, the stricter check controls. G3 through G5 must remain off and inaccessible until complete.

### B4. Operational checks before pilot

- Correct hostname and valid HTTPS without `-k`.
- Both readiness endpoints return intended codes; health is not merely the proxy returning 200.
- No exposed development dashboards, source maps containing secrets, public media buckets, or unauthenticated private APIs.
- A real CI_ADMIN can log in with individually provisioned credentials and can change/reset them through the selected provider.
- Unauthorized, expired, invalid-audience and cross-role accesses are rejected server-side.
- Map loads on desktop/mobile within measured hardware/network budgets; feed failures degrade visibly without blanking the UI.
- Coolify deployment has a known-good previous image/commit and documented one-step rollback.
- Logging, alerting, backup and restore checks are documented. First day production checks are performed from outside the server.
- No direct production database schema deletion, truncation or forced migration; use additive migrations and verify before promotion.

---

## C. Deferred capability: 4D Spatial Memory Palace

### C1. Outcome and non-goals

Build an opt-in **Spatial Memory** subsystem that links source-aligned observations to specific positions and times and, when supported by the evidence, creates inspectable 3D or 4D reconstructions. The operating picture must always distinguish recorded observations from algorithmically reconstructed or interpolated views.

**Initial use cases (priority order):**
1. Reconstruct a known test incident’s FSK signal, dispatch, CCTV snapshot/clip and vehicle movement on a shared timeline.
2. Compare authorized video observations of one client site at different times or from different cameras.
3. Display a static georeferenced 3D model/point cloud of an S²-owned training site.
4. Reconstruct object movement within a short, controlled, multi-camera scene.
5. Explore longer-term site change / satellite observation as clearly attributed layers.
6. Forecasting or advanced anomaly analysis as separate, explicitly uncertain research, not actionable ground truth.

**Explicit non-goals:** Always-on recording of everyone; uncontrolled scraping of cameras; access to footage without consent/authority; crowd or person identity tracking beyond a validated lawful use case; replacing original recordings with AI-generated “evidence”; global, unrestricted surveillance; remote alarm actuation; autonomous police/security operational decisions.

### C2. Architecture and ownership

```text
Approved, authorized source systems
  FSK/CI incident references | Camera registry/media API | dispatch/tracker observations
  Public / licensed geospatial datasets | controlled S2 site photos/drone capture
                                 |
                Authenticated ingestion adapters (read-only by default)
        scope check -> timestamp normalize -> checksum -> provenance -> correlation
                                 |
               Observation/event store + spatial/temporal index
              PostgreSQL/PostGIS candidate; object storage (S3 compatible)
                     immutable originals + derived-artefact lineage
                                 |
          Replay and reconstruction jobs (lab isolated; queued, bounded)
      synchronization | camera calibration | SfM/MVS | splat/mesh | quality
                                 |
              Cesium Godseye UI: Live / Replay / Spatial Memory
          time slider | 3D layer | source inspect | uncertainty | audit
                                 |
             Case/evidence export; analyst review; Captain read-only skill
```

The **S² Command/control room** remains the system of record for alarms, acknowledgments, dispatch and incident dispositions. Godseye stores **references and authorized copies**, never becomes the serial receiver or live alarm dispatcher. Any future remote control feature is separate and governed.

### C3. Core data contracts (candidate, additive only)

- `source_system`: id, owner, source class, permission scope, health, retention and license reference.
- `site`: id, customer reference, coordinate reference system, geofence/footprint, accuracy, access policy.
- `camera`: id, site_id, zone, stream reference (not credentials), position/orientation/FOV calibration and calibration version.
- `observation`: id, source_system_id, site_id, source_event_id, observed_at_utc, ingested_at_utc, location, location_accuracy_m, confidence, verification_state, actor/class, source hash, correlation_id, privacy class.
- `time_alignment`: clock domain, measured offset and drift, method, uncertainty, observation period and calibration evidence.
- `media_asset`: id, source URI/private storage key, SHA-256, MIME, capture timestamp, duration, size, dimensions, sensor info, original/derivative, access scope, retention.
- `scene`: id, version, site_id, reference frame, bounding volume, capture interval, geometry format, reconstruction state, quality metrics.
- `scene_asset`: scene_id, media_asset_id, estimated pose, reprojection error, calibration confidence, inclusion/exclusion reason.
- `reconstruction_job`: id, requested_by, approved_scope, job state, algorithm/model/parameters/version, input hashes, timestamps, resource budget, derived output links, errors.
- `event_track`: id, scene_id, associated observation ids, time-stamped coordinate samples, interpolation policy, measured uncertainty and actor confidence.
- `review`: id, reviewer, finding, accepted/rejected/amended, timestamp, evidence links.
- `audit_event`: actor, action, object, before/after references when lawful, authorization reason, timestamp and immutable receipt id.

Use UUIDs, constrained foreign keys, tenant/site row-level access, UTC timestamps and explicit geodetic or projected coordinate reference systems. Ensure no implicit inference of person identity from a camera track. Prefer Postgres + PostGIS if already operationally supported; do not deploy new databases merely for the prototype.

### C4. Processing stages

**Stage 0: source registration and authority.** Approved dataset, lawful authorization, retention rule and target geofence are recorded. Deny ingestion if provenance, permissions or consent basis are missing.

**Stage 1: acquisition.** Pull selected alarm/event metadata, authorized CCTV clips/images and eligible telemetry through existing S² adapters. Honor connector quotas and rate limits. No direct access to client routers or cameras outside an approved integration path. Preserve source originals, record cryptographic hashes and read time.

**Stage 2: time and coordinates.** Normalize all timestamps to UTC with source clock offset and uncertainty. Georeference sensor positions and observations; distinguish measured GPS from estimated camera rays or inferred event sites. Maintain transforms from image/video pixel to camera to local scene to WGS84.

**Stage 3: alignment.** Correlate by site, bounded time window, camera overlap and reliable event identifiers. Support multiple observations with conflicting times; preserve the conflict rather than choosing the “best” unobservably.

**Stage 4A: low-cost MVP replay.** Cesium timeline slider plus map pins, clip player, observation thumbnails and source citations. If no 3D reconstruction is available, playback must still be useful.

**Stage 4B: static reconstruction.** Controlled captures with overlapping photos and known scale/control points; evaluate COLMAP / OpenDroneMap / Nerfstudio / gsplat as appropriate. Export a stable georeferenced scene and metrics. Avoid assuming that all single-view video can yield accurate 3D.

**Stage 4C: temporal reconstruction.** For supported, timestamp-aligned multi-camera video, estimate moving-object poses/tracks over time. Display translucent historical poses or trajectories. Compare output against manually surveyed/control observations.

**Stage 5: review/export.** Analysts can inspect every generated pose’s source images, assumptions and uncertainty. Produce reproducible JSON/report outputs and hashes. Machine output is never silently marked verified.

### C5. User interface (future, feature-switched)

- Add a `Spatial Memory` tab or mode to Godseye, not a standalone competing product.
- Existing Live mode remains default. Replay mode is read-only and explicit.
- Case/site selector, date-time range, timeline slider, playback speed, source filters, overlay visibility and per-layer “recorded / derived / simulated” badges.
- 3D scene and source media displayed side-by-side with jump-to-time and jump-to-location.
- Provenance inspector: who supplied the media, when captured, hash, calibration, quality, access policy, model/algorithm version and reviewer.
- Offline/error/degraded states that tell the truth. Redaction controls for faces, number plates and private surroundings where required.
- Permission-scope controls for export/share and a logged review/approval workflow.
- Keyboard and touch support. Keep data volume bounded so mobile operator access remains usable.
- Subtle S² Tech branding consistent with the main application.

### C6. Technical evaluation matrix

| Component | Candidate | Why | Qualification |
|---|---|---|---|
| Viewer | Existing CesiumJS | Current application foundation | Reuse and test large scene performance |
| Temporal events | PostgreSQL + PostGIS | Spatial/temporal joins | Reuse only if compliant/currently available |
| Media originals | S3-compatible object storage | Provenance and controlled access | Private by default, retention and encryption |
| Static photogrammetry | COLMAP | Camera poses / sparse+dense reconstruction | Test accuracy on known measurements |
| Drone mapping | OpenDroneMap | Orthomosaic/3D outdoor scenes | Optional, no extra client hardware |
| NeRF/Gaussian splatting | Nerfstudio/gsplat | Realistic scene exploration | Lab GPU resource and license review |
| 3D transport | glTF / 3D Tiles / point-cloud variants | Cesium-friendly assets | Benchmark browser sizes and LOD |
| Clips and snapshots | Existing S² Edge media adapters / go2rtc where authorized | Reduce duplicate ingest | Never expose credentials or unrestricted streams |
| Batch jobs | Existing governed worker/queue | Bounded async processing | Quotas and reproducible logs |

Do not promise that these libraries reproduce the author's proprietary or unreleased workflow. Benchmark before adoption. Review upstream MIT source separately from each feed, tile, model, dataset and external media license.

### C7. Build packages and dependencies

| Package | Deliverable | Blocked by | Exit criteria |
|---|---|---|---|
| SPAT-00 | Dataset license, threat/privacy model, budget and test corpus | M0 + security approval | Authorized 2-3 controlled sequences |
| SPAT-01 | Shared time/event schema and replay API | M2 case/evidence model | Stable idempotent retrieval and timestamp uncertainty |
| SPAT-02 | Replay UI without 3D | M3 geospatial timeline | Source-cited 1 incident end-to-end |
| SPAT-03 | Camera calibration and scene spatial reference | Camera registry, approved media | Surveyed error reported |
| SPAT-04 | Static 3D proof of concept | SPAT-03 | Repeatable build and 3D Cesium render |
| SPAT-05 | 4D object-track lab | SPAT-04, multi-view data | Time alignment + ground-truth error measured |
| SPAT-06 | Review/export + retention and audit | SPAT-01...05 | Traceable output, redaction, corruption detection |
| SPAT-07 | Limited internal operational pilot | Independent review + all gates | Human-reviewed sample reports only |
| SPAT-08 | Commercial service readiness | Pilot evidence + written client terms | Measured margin, legal review, supported SOP |

No SPAT implementation should merge or deploy until SPAT-00 is authorized. Modules are individually feature-flagged and can be rolled back independently.

### C8. Required deterministic tests

1. Same sample sources yield same replay event ordering and source references.
2. Out-of-order and duplicate FSK messages neither disappear nor create false incidents.
3. Camera drift / missing timestamp / timezone shift produces visible uncertainty and a warning.
4. Disagreement between two sources is preserved and inspectable.
5. Missing/unhealthy camera or satellite layer does not block the map or incident report.
6. Original media hashes remain unchanged; altered source is detected.
7. Derived scene links to all original assets and complete model/parameter versions.
8. Camera georeferencing error is measurable against independently surveyed control points.
9. Reconstruction gaps and impossible tracks are rejected or labeled unverified.
10. Role scope blocks cross-client evidence, media URLs and exports.
11. Live control-room/FSK data remains unaffected during replay and heavy processing.
12. Load tests quantify frame rate, memory, job time, disk, bandwidth and failure recovery.
13. Report clearly separates recorded fact, inferred reconstruction and analyst opinion.
14. Source removal/retention changes propagate to derivatives consistent with legal holds.
15. Security reviewer independently verifies access, signed URLs, job isolation and prompt-injection boundaries where models are used.

### C9. Metrics and provisional thresholds (to be baselined, not fabricated)

Measure: timestamp-offset uncertainty (ms), position error (m), reprojection error (pixels), 3D alignment error vs reference, source coverage (%), reviewer agreement, p50/p95 replay query latency, Cesium FPS/memory, processing minutes per clip, storage GB/site, cost per case, upload success and retention deletions. Establish reasonable targets using a controlled local baseline before enforcing acceptance numbers. An asset may be used for explanatory visualization even when reconstruction quality is not sufficient for evidentiary conclusions, but this distinction must be explicit.

### C10. Privacy, retention and evidential safeguards

- POPIA-aligned purpose limitation, minimum necessary capture, recorded lawful basis, access controls, retention schedule and incident reporting process.
- Written client authority for cameras/tracking; restrict public-source geospatial ingestion by licensing and terms; do not build a global person-tracking service.
- Site/tenant separation, least privilege, envelope encryption/secret management, expiring signed media URLs, no public buckets.
- Hash originals upon ingestion and avoid overwriting them. Preserve audit events and immutable review history where appropriate; enforce legal holds separately from ordinary retention.
- Computer-generated poses, surfaces and predictions require model/algorithm references, uncertainty and "reconstructed, not direct observation" labeling.
- Redact or restrict unnecessary personal information in exports. Review all proposed AI identification and automated surveillance applications separately.
- Recovery plans address storage or queue outage, incomplete jobs, loss of camera connectivity and damaged outputs. No implicit collection expansion.

### C11. Cost and infrastructure strategy

**Default budget: R0 in additional software licensing**, using existing machines, server, storage and open-source tooling. This is **not** a claim of zero electricity, bandwidth, storage or time cost. Prefer event-triggered clip processing over continuous cloud video ingest. No new client-site hardware is presumed. Heavy photogrammetry/Gaussian splat batch jobs run in an isolated research worker only after RAM/GPU/storage audit. Cache results and use CPU/static model fallbacks when GPU resources are unavailable. Require budget/cap approval before any paid imagery, model, storage or hosted provider is enabled.

### C12. Risks and mitigation

| Risk | Mitigation |
|---|---|
| Main CI launch delayed by R&D | SPAT flags OFF; separate roadmap branch, no cross-dependency on M0 |
| User sees inferred model as fact | Visible confidence, original-media toggle, reviewer states |
| FSK or CCTV disrupted | Read-only adapters, bounded queues, isolated processing |
| License / POPIA breach | Per-source license and client authority gate before ingest |
| High compute/storage costs | Small fixture datasets, batch limits, no continuous universal recording |
| Bad time sync leads to false correlation | Drift and accuracy fields, negative tests, manual review |
| Production route / auth issue | Fix G0/G1 before any private data is exposed |
| Accidental schema loss or overwrite | Add-copy-verify-deprecate migrations only |
| Vendor API unavailability | Source degradation and fallback, never invented observations |

---

## D. Delivery order, responsibility and deferred start condition

### D1. Now: CI launch backlog, strict order

1. **CI-START-01** Confirm Coolify app + reverse-proxy service ownership and diagnose 503; do not change unrelated services.
2. **CI-START-02** Correct production HTTPS, DNS/host routing and service readiness.
3. **CI-START-03** Integrate reviewed portal shell with protected server API runtime and the chosen identity provider; no Vercel dependency in deployed runtime.
4. **CI-START-04** Provision individual administrator access, test login/logout, role denial, password change/reset and security headers.
5. **CI-START-05** Confirm live Cesium scene, non-sensitive feeds, freshness/health UI and graceful degradation.
6. **CI-START-06** Run and retain full test, security, performance and rollback evidence; promote only an explicitly reviewed image/commit to Coolify.
7. **CI-START-07** Validate live URL externally with a real administrator; document remaining M1/M2/M3 gaps and set the operational scope accurately.
8. **CI-START-08** Then implement persisted `/lab`, FSK replay fixtures, evidence, and customer-camera intelligence under the existing master programme.

### D2. Future: SPAT activation rule

Spatial Memory work begins only when:
- M0 administrator-accessible pilot is stable and independently verified;
- a reviewed case/evidence/provenance data layer exists;
- at least one authorized replayable CCTV/FSK test incident is available;
- source/retention/privacy review completed;
- tests, rollback, storage and workload budgets exist;
- product owner explicitly releases `SPAT-00` from the deferred backlog.

The phase ordering must not become a blocker for M0, M1 or M2.

### D3. Work ownership

- **Product / operations owner:** defines operator workflows, clients/scopes and launch approval.
- **CI engineering:** Cesium/UI, APIs, schemas, feature flags, integration and test automation.
- **S² Command/FSK integration owner:** provides stable read-only incident references and fixture interface; owns live receiver isolation.
- **S² Edge/CCTV owner:** camera/site metadata, authorized clips and stream health.
- **Privacy/security reviewer:** approval scopes, role tests, evidential integrity and incident controls.
- **Independent release verifier:** checks code, tests, deployment evidence and rollback prior to production promotion.

### D4. Definition of done

**This document** is done when committed to an isolated docs-only branch, discoverable from the canonical repository, and explicitly marked DEFERRED. It does **not** prove any CI service deployed.

**M0** is done when `ci.s2tech.co.za` has trusted TLS, an operational deployment, protected admin login and a working map/feed-health experience, all with recorded evidence.

**4D** is done only when the authorized pilot shows reproducible, source-linked spatial replay with measured error, auditable originals/derivatives, controls and review; a demonstration-only deer-style 3D animation is not completion.

---

## E. Current action/evidence ledger

| Work | State as of 2026-10-08 |
|---|---|
| Godseye canonical source and organisation fork | VERIFIED |
| Portal/auth/Captain lab branches present | VERIFIED, not integrated/promoted |
| Lab CI unit tests | VERIFIED 40/40 PASS |
| Public `ci.s2tech.co.za` HTTPS | BLOCKED: untrusted chain and HTTP 503 |
| Correct Coolify app health and reverse proxy cause | UNKNOWN: server-side inspection required |
| Valid admin login at CI production domain | NOT VERIFIED |
| Current full lint, typecheck, production build and E2E | NOT VERIFIED in this plan |
| Production rollback and deploy receipt | NOT VERIFIED |
| FSK /lab replay, evidence vault, camera lab integration | Documented as outstanding |
| 4D integration design | DOCUMENTED, deferred |
| 4D integration code/production deployment | NOT STARTED; intentionally OFF |

**Change policy:** Documentation-only roadmap branch. No production services, DNS, database data, remote devices, live receiver inputs, cameras or public website were modified by authoring this plan.

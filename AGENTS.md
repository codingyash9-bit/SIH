# SIH Vehicle Intelligence — Implementation Guide

This file is the maintained implementation contract for agents and contributors working in this repository. Update it when the team confirms a material change to product scope, architecture, data, design language, or evaluation procedure. Do not turn unconfirmed ideas into requirements.

## 1. Product intent

Build a secure government operations prototype for city-wide vehicle intelligence using authorized ANPR/CCTV feeds. The core outcomes are:

1. detect and read Indian vehicle registration plates under difficult conditions;
2. verify whether the observed vehicle identity is consistent with an authorized registry response;
3. identify suspected bogus, cloned, obscured, or duplicated plates;
4. reconstruct cross-camera vehicle trajectories with observed and inferred segments clearly separated;
5. visualize real-time and historical traffic movement on a GIS interface;
6. generate explainable alerts and manage them through review, assignment, tracking, and resolution; and
7. provide privacy-preserving aggregate traffic analytics.

The system is decision support. A machine-generated mismatch or anomaly is not proof of an offence. Enforcement-relevant alerts require human review.

## 2. Source of truth and change discipline

Use this precedence order:

1. the team's latest explicit decision and supplied procedures;
2. the official SIH problem statement;
3. accepted module, schema, dataset, and test specifications in this repository;
4. current official government or primary technical sources; and
5. clearly labelled recommendations or hypotheses.

Record decision-relevant online sources in `SOURCES.md`, including authority, URL or local path, access date, supported claim, licence/terms, and limitations. Internet availability does not imply legal or authorized data access.

When requirements conflict, document the conflict and ask for a decision if it materially changes implementation. Preserve existing user work and avoid unrelated changes.

## 3. Access assumptions

- Do not claim that the application itself has access to every CCTV or street camera in India.
- Treat government ownership or authority as the reason an authorized sponsor may provision particular feeds, credentials, camera metadata, and registry/watchlist integrations.
- Implement vendor-neutral camera adapters for RTSP, recorded video, image batches, and simulated event streams.
- Register every camera with jurisdiction, precise surveyed location, viewing direction, lanes, time-synchronization status, stream health, and access classification.
- Do not scrape VAHAN/Parivahan, CAPTCHA-protected portals, private CCTV, or restricted databases. Use an authorized adapter or a mock service with synthetic records.
- Keep secrets outside source control and never place personal data, plate histories, access tokens, or raw evidence in logs.

## 4. Identity evidence hierarchy

Use an evidence fusion pipeline rather than a single yes/no plate check. Recommended priority:

| Priority | Evidence | Purpose |
|---|---|---|
| P0 | Plate crop quality, OCR hypotheses, syntax, timestamp, camera and lane | Establish the observation and uncertainty |
| P1 | Authorized registry match: registration status, vehicle class, make/model, registered colour and permitted attributes | Test whether the observed identity is plausible |
| P1 | Spatiotemporal feasibility across camera sightings and the road graph | Detect impossible travel and competing physical vehicles |
| P2 | Observed vehicle class, make/model family, colour and body shape | Detect plate-to-vehicle mismatch |
| P2 | Cross-camera vehicle re-identification embedding | Associate a physical vehicle when the plate is unclear |
| P3 | Persistent visual fingerprint: decals, dents, roof rack, wheel style, damage, cargo/body modifications | Separate visually similar or cloned vehicles |
| P3 | Plate physical cues: layout, HSRP appearance, mounting, font/spacing, reflectivity where camera quality supports it | Detect likely tampering; never claim forensic certainty from weak pixels |
| P4 | Direction, route history, recurrence, geofence and behaviour patterns | Add contextual anomaly evidence |
| P5 | Driver/cabin evidence | Optional, lowest-priority, high-risk evidence requiring explicit lawful authority and access controls |

Do not use owner identity as a visual matching feature. Driver face recognition is outside the default prototype. Faces must be blurred by default; reveal or comparison requires an explicitly authorized role and an audited purpose.

## 5. Plate and vehicle permutations

Model identity as observations connected to one or more candidate physical vehicles. Cover at least these cases:

### A. Same plate, clearly different vehicle class/model/colour

Likely clone or plate misuse. Trigger a high-priority mismatch when OCR is strong and registry/visual attributes disagree. Require another observation or human confirmation before escalation.

### B. Same plate, same model, different colour

Compare registry colour, lighting-normalized colour estimates, timestamps, physical fingerprints, and route feasibility. Treat colour alone as insufficient because lighting, repainting, wraps, and registration-update delays can mislead.

### C. Same plate, same model and same colour, distinguishable physical details

Cluster sightings using vehicle re-identification plus persistent features such as decals, dents, roof accessories, wheels, plate mounting, and body modifications. Show the matched features and uncertainty to the reviewer.

### D. Same plate, visually indistinguishable vehicles

Vision alone may not determine which vehicle is genuine. Detect duplication through simultaneous or impossible-travel sightings, continuity from trusted sightings, authorized HSRP/RFID/toll or enforcement checks when available, and manual roadside verification of chassis/engine-linked records. Label the result `suspected clone pair`; do not declare one vehicle genuine without stronger evidence.

### E. Same physical vehicle, OCR variations

Retain top-k OCR candidates and character-level confidence. Resolve confusions such as `0/O`, `1/I`, `5/S`, and `8/B` using Indian plate grammar, repeated sightings, registry candidates, and vehicle appearance. Never silently overwrite the raw OCR result.

### F. Two plates on one physical vehicle over time

Use stable vehicle appearance/re-identification and temporal continuity to flag plate switching. Account for legitimate plate replacement or registration changes via the authorized registry workflow.

### G. Duplicate plate sightings that are geographically feasible

Do not alert solely because a plate occurs repeatedly. Use visual inconsistency, route discontinuity, overlapping time windows, camera direction, and evidence quality to determine whether multiple physical vehicles are plausible.

## 6. Detection and tracking pipeline

Keep each stage replaceable and versioned:

```text
camera/file/replay input
  -> decode and timestamp normalization
  -> vehicle + plate detection
  -> within-camera multi-object tracking
  -> plate rectification and OCR top-k
  -> vehicle attributes + appearance embedding
  -> registry/mock-registry verification
  -> cross-camera association on road graph
  -> rule/risk engine
  -> event store + evidence store
  -> realtime API
  -> map, triage, case and analytics UI
```

### Model strategy

- Treat YOLOv8/YOLOv10 or another YOLO-family detector as baselines to benchmark, not predetermined winners.
- Evaluate current supported detector variants against the provided Indian test data, hardware, latency target, licence, export path, and exact-match plate accuracy.
- Use a dedicated plate detector/crop stage and OCR recognizer; generic object detection does not replace OCR.
- Baseline within-camera tracking with ByteTrack for speed and BoT-SORT with re-identification for harder occlusion/association cases.
- Cross-camera tracking must combine plate hypotheses, vehicle embeddings, attributes, travel-time feasibility, camera topology, and direction. Do not carry local tracker IDs across cameras as global identity.
- Use confidence calibration and rule explanations. Store model, preprocessing, threshold, calibration, and rule versions with every derived event.
- For NVIDIA deployment, DeepStream may be evaluated for multi-stream decode/inference/tracking; keep the prototype architecture portable and do not make GPU-specific infrastructure mandatory.
- Review model and library licences before adoption. In particular, do not assume an Ultralytics package licence is automatically suitable for enterprise/government distribution.

### Accuracy reporting

Report at least:

- vehicle and plate detection precision/recall and mAP;
- character accuracy and full-plate exact-match accuracy;
- results by day/night, weather, angle, blur, occlusion and plate condition;
- tracking IDF1/HOTA or accepted equivalent and ID switches;
- cross-camera association precision/recall;
- attribute accuracy by class;
- alert precision, recall, false-alert rate and time-to-review; and
- end-to-end latency and throughput per stream.

The SIH target of greater than 90% must always state the metric, dataset, split, and conditions. Do not present character accuracy as full-plate exact-match accuracy.

## 7. Live radar and GIS semantics

Use MapLibre GL JS for the interactive map. Use OpenStreetMap-derived vector data through a provider whose terms permit the prototype, such as OpenFreeMap for development, or self-hosted tiles for controlled deployment. Keep the tile provider configurable, display required attribution, and never bulk-download community OSM tiles contrary to their policy.

Use deck.gl layers where they materially improve rendering:

- animated trip/path layer for trajectories;
- scatter/point layer for camera sightings;
- heatmap or hex layer for aggregate density; and
- arc/path overlays for origin-destination flow.

The `Live Radar` view is event-driven, not literal radar and not continuous GPS:

- a solid pulse at a camera means an observed sighting;
- a solid route segment connects confirmed sequential sightings;
- a dashed/fading segment means road-network interpolation between sightings;
- a translucent prediction cone or corridor means possible next cameras, with confidence and expiry;
- vehicle markers must not glide through unobserved roads as if their precise location were known;
- show last-seen time, data freshness, playback/live state, and uncertainty;
- allow timeline scrub, pause, replay speed, camera filtering, target focus and city overview; and
- cluster or aggregate ordinary vehicles at wider zoom levels to avoid visual overload and unnecessary identification.

Send compact detection events through WebSocket or server-sent updates; do not stream full-resolution video to every dashboard client. Video/evidence should load only when selected and authorized.

## 8. Prototype data and real-time test procedure

The prototype does not require access to a stranger's live security camera. Use a reproducible live-replay harness:

1. Obtain team-recorded, consented staged road/parking footage, properly licensed public traffic footage, synthetic scenes, or organizer-provided test clips.
2. Create several logical cameras with stable IDs, map coordinates, directions and road connections.
3. Split or select clips so the same staged vehicles appear at multiple logical cameras.
4. Provide a scenario manifest containing source video, intended start time, time offset, camera metadata, expected sightings and ground-truth identities.
5. Replay clips concurrently at 1x through local RTSP streams, virtual camera adapters, or timestamped file readers.
6. Publish detections to the same event interface used for future live camera adapters.
7. Simulate network jitter, dropped frames, offline cameras, clock drift, blur, night conditions, and delayed events.
8. Run scenarios repeatedly and compare output with versioned ground truth.

Required fixtures:

- ordinary valid vehicle;
- low-confidence OCR resolved by later sightings;
- plate/vehicle attribute mismatch;
- same plate on two different vehicles;
- same plate on visually similar vehicles at impossible locations;
- plate switching on one vehicle;
- watchlist hit requiring human review; and
- an aggregate congestion event.

Synthetic registry records must avoid real owner identities. If real plates appear in licensed or team footage, mask or replace them in shareable demos unless explicit authorization allows their use.

## 9. Use cases and implementation priorities

### Must-have prototype (P0)

- secure mock login and operator role;
- registered camera nodes and synchronized replay inputs;
- vehicle/plate detection, OCR top-k and confidence;
- mock authorized registry verification;
- observed-versus-registered colour/class/model comparison;
- live radar map with observed versus inferred movement;
- exact/partial plate search and chronological trajectory;
- duplicate/impossible-travel alert;
- human triage and complete target lifecycle;
- evidence provenance and audit events; and
- basic traffic density/flow view.

### Strong differentiators (P1)

- cross-camera vehicle re-identification;
- cloned-plate candidate clustering;
- explainable multi-signal risk scoring;
- predicted next-camera corridor;
- camera-health and OCR-quality monitoring;
- origin-destination and bottleneck analytics; and
- multilingual-ready layout.

### Later/conditional (P2)

- production VAHAN/watchlist integration;
- HSRP/RFID/toll or other authorized sensor fusion;
- advanced make/model classification and damage fingerprinting;
- edge inference and enterprise streaming infrastructure;
- driver/cabin analysis under separate lawful authorization; and
- automated enforcement-system integration.

## 10. Architecture direction

The team has confirmed that main detection, spatial, backend, alert and case logic must be implemented in Python and Java. TypeScript remains acceptable for the web client and design-layer integration only.

Preserve these service boundaries:

- ingestion adapters;
- vision inference workers;
- identity/association service;
- rules and alert service;
- case-management service;
- realtime gateway;
- relational/spatial event store;
- object evidence store;
- audit store; and
- web operations client.

The confirmed prototype direction is React/Next.js + TypeScript for the dashboard, MapLibre + deck.gl for geospatial visualization, Python/FastAPI workers for ingestion/AI/spatial computation, Java/Spring Boot for the operations API and lifecycle workflows, and Supabase PostgreSQL/PostGIS for relational data, authentication, realtime delivery and private evidence storage.

Use a relational, append-only `detections` event store as the source of truth. Derive `live_today_detections`, `historical_detections` and `recorded_days` from that table using India-calendar-day semantics; do not maintain duplicate live/archive tables or copy rows at midnight. Add pgvector only as a separate, optional physical-vehicle association layer after the re-identification model and embedding dimension are confirmed.

The browser must never receive service-role credentials or write sensitive observation/registry tables directly. Python and Java own writes and validation; the frontend receives jurisdiction-scoped DTOs and compact realtime events. Use keyed HMAC tokens for exact plate lookup rather than storing raw plate text or unsalted hashes. Keep registry snapshots backend-only and synthetic until an authorized adapter is supplied.

Database changes must use migrations. Enable row-level security for exposed Supabase tables, separate public/map aggregates from sensitive observations, use short-lived signed evidence URLs, and run security advisors after material schema changes.

## 11. Futuristic minimal design system

Aim for `quiet intelligence`: futuristic through spatial depth, motion, precision and live feedback—not neon decoration.

### Visual direction

- dark graphite/navy operational canvas with a restrained light mode if time permits;
- near-black map with muted roads and administrative boundaries;
- cyan/ice-blue for selected/live information, amber for review, red only for confirmed critical alerts, violet for inferred/predicted data, and green for resolved/healthy;
- translucent elevated surfaces only where layering communicates hierarchy; avoid excessive glassmorphism and blur;
- thin borders, soft inner highlights, large-radius panels used consistently, crisp typography and monospaced numerals for plates/timestamps;
- generous whitespace in details, compact density in alert tables, and progressive disclosure for raw metadata;
- subtle grid, scan, pulse or radar motifs confined to the live map and loading states; and
- authentic evidence imagery rather than decorative surveillance stock art.

### Layout options

- desktop-first command shell with collapsible left navigation, top global search/status bar, central map or workspace, and contextual right evidence drawer;
- map-to-case shared-element transition so a selected vehicle/card retains identity across views;
- split view for alert triage: evidence and comparison on one side, map/timeline on the other;
- focus mode that enlarges a target trajectory while retaining a compact alert rail; and
- responsive degradation for tablets, but do not pretend the full command centre is optimized for small phones.

### Motion and transitions

Use motion to preserve context and indicate system state:

- shared-element transitions between map marker, alert card and vehicle identity header;
- short spring/tween panel transitions, staggered evidence-card entry and cross-fade/number interpolation for metrics;
- route drawing and camera pulse only when new evidence arrives;
- timeline scrub with deterministic vehicle-path replay;
- morphing right drawer for detection -> alert -> case without a full-page reset;
- skeleton states shaped like the final layout;
- View Transition API where supported with a robust non-animated fallback; and
- full `prefers-reduced-motion` support. Disable route sweeps, parallax, repeated pulses and large movement when reduced motion is requested.

Avoid long cinematic intros, constant glowing animation, 3D tilt that harms map reading, motion on every hover, fake terminal text, autoplay video walls, and decorative effects that conceal freshness or confidence.

### Core interaction components

- global plate/vehicle query with OCR-tolerant matching;
- live/replay mode switch and visible simulation badge;
- severity + confidence + freshness indicators;
- observed-versus-registered comparison matrix;
- evidence card with capture source, timestamp, model version and integrity state;
- alert explanation panel with fired rules and contrary evidence;
- camera/trajectory timeline scrubber;
- role-aware action bar;
- audit drawer; and
- explicit empty, offline, stale, insufficient-evidence, permission-denied and error states.

## 12. Security, privacy and audit invariants

- Apply least privilege by role, jurisdiction, case and purpose.
- Require MFA/SSO in production; prototype it visibly even if mocked.
- Encrypt transport and stored sensitive data; keep evidence separate from derived metadata.
- Hash evidence and record chain-of-custody events.
- Log reads, reveals, exports, watchlist changes, alert decisions and case closure.
- Put expiry/review dates on watchlists and target cases.
- Blur faces by default and restrict unmasking.
- Never expose sensitive observations through public map tiles, frontend bundles, analytics endpoints or telemetry.
- Use human approval before enforcement action or definitive clone classification.

## 13. Definition of done for implementation work

Before calling a feature complete:

- verify the happy path and relevant degraded/error states;
- test with the versioned replay scenario and ground truth;
- confirm observed, inferred and predicted states are visually and semantically distinct;
- record data/model/rule provenance;
- check keyboard navigation, contrast, focus visibility and reduced motion;
- ensure map attribution and dataset/model licences are present;
- confirm permissions and audit behaviour for sensitive actions;
- avoid fabricated integrations, accuracy claims, or continuous-location precision; and
- update documentation, `SOURCES.md`, fixtures and migrations affected by the change.

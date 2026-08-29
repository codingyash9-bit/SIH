# Database and backend contract

## Decision

Use a relational/spatial event store as the authoritative database. Supabase PostgreSQL stores cameras, append-only detections, alerts, cases and audit history; PostGIS supplies map geometry and indexed spatial queries.

Vector search is not the primary database structure. Add a separate `vehicle_embeddings` table only after the team selects a re-identification model and confirms its embedding dimension, licence and evaluation procedure. Vector similarity may propose associations; it must never overwrite raw observations or decide that a vehicle is genuine.

## Live day and recorded days

There is one canonical `detections` table. A trigger derives `observed_on` in `Asia/Kolkata` from the UTC `captured_at` timestamp.

- `live_today_detections` automatically exposes the current India-calendar-day rows.
- `historical_detections` exposes rows before today.
- `recorded_days` produces one archive card per date with counts, camera coverage and time range.

No midnight copy or duplicate "today" table is needed. At 00:00 IST, the views roll forward automatically and the prior day's rows immediately appear in history. This makes replayed prototype data follow the same flow as future authorized camera events.

## Backend ownership

Main business and AI logic stays in Python and Java:

| Boundary | Owner | Responsibility |
|---|---|---|
| Ingestion and AI | Python service | Validate camera event, run OCR/attributes, create the HMAC plate token, write detection and OCR candidates |
| Spatial intelligence | Python service | PostGIS queries, OSM road matching, trajectory reconstruction, density/OD jobs |
| Operations API | Java service | Authentication context, alert/case lifecycle, assignments, resolutions, audit and authorized registry adapters |
| Dashboard | React/TypeScript | Read backend DTOs, render MapLibre/deck.gl views, subscribe to compact authorized realtime events |

The browser must not receive the Supabase service-role key or write sensitive tables directly. Python and Java use server-side credentials. The dashboard may use a publishable key only for explicitly RLS-protected read/realtime paths, or consume everything through the Java API gateway.

The implemented prototype uses `dashboard/src/api.ts` as the frontend boundary. Set `VITE_OPERATIONS_API_URL` to the Java gateway URL; when it is absent or unavailable, the interface deliberately falls back to the coherent synthetic scenario in `dashboard/src/prototypeData.ts`. Python ingestion is implemented under `backend/python`, and the Java alert/case operations boundary is under `backend/java`.

## Initial API surface

```text
POST /api/v1/detections                 Python ingestion (service-authenticated)
GET  /api/v1/live/detections            Today's authorized sightings
GET  /api/v1/archive/days               Recorded-day cards
GET  /api/v1/archive/days/{yyyy-mm-dd}  One day's sightings
GET  /api/v1/vehicles/{plate}/trajectory Ordered observations + inferred route
GET  /api/v1/alerts                     Alert triage queue
PATCH /api/v1/alerts/{id}               Assign, pend, resolve or dismiss
GET  /api/v1/cases?status=live|pending  Case work queues
POST /api/v1/cases/{id}/events          Audited case action
```

Exact plate search uses a keyed HMAC-SHA-256 token produced by the backend. A plain SHA hash is not sufficient because the Indian registration space can be enumerated. Prototype plaintext fields are restricted to explicitly synthetic data.

## Event flow

```text
camera adapter / replay harness
  -> Python detection pipeline
  -> Supabase detections + evidence object path
  -> rule evaluation
  -> alerts / cases / audit
  -> Realtime compact event or Java WebSocket gateway
  -> Live Radar, Alerts, Cases and Recorded Days UI
```

Evidence images/video belong in a private Storage bucket. Database rows keep only the object path, SHA-256 digest, provenance and authorization metadata. The backend issues short-lived signed URLs after a role, jurisdiction and purpose check.

## Scaling path

The prototype uses indexed rows and Supabase Postgres Changes for a simple live feed. For city-scale traffic, send only reduced map events via Supabase Broadcast or a Python/Java gateway; do not replicate full detection payloads or video to every client. Add time partitioning only after measured row volume and query plans justify it. Add daily aggregate tables for long-range analytics while retaining raw observations according to an approved retention schedule.

## Applying the migration

The migration is at `supabase/migrations/202608250001_core_vehicle_intelligence.sql`. Apply it first to a Supabase development branch/project, then run Supabase security and performance advisors. Hosted deployment still needs a selected project, storage-bucket policy, secrets, and actual operator accounts; those are intentionally not fabricated in this repository.

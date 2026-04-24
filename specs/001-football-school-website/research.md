# Research: Football School Team Website

**Feature**: 001-football-school-website
**Date**: 2026-04-23

## Research Tasks

### 1. Real-Time Match Updates: Polling vs WebSockets vs SSE

**Decision**: Short polling with TanStack Query `refetchInterval`

**Rationale**:
- SC-004 requires updates within 10 seconds — polling every 5 seconds satisfies this easily.
- The existing stack (FastAPI + TanStack Query) supports polling natively with zero new dependencies.
- Concurrent viewers during a match are expected to be in the hundreds, not thousands — polling at 5s intervals is well within capacity.
- WebSockets would add complexity (connection management, reconnection logic, FastAPI WebSocket handlers) for minimal benefit at this scale.
- SSE is simpler than WebSockets but still requires a persistent connection and is not natively supported by TanStack Query.

**Alternatives considered**:
- WebSockets: Rejected — unnecessary complexity for the expected scale and latency requirements.
- Server-Sent Events (SSE): Rejected — requires persistent connections and custom TanStack integration.
- Long polling: Rejected — more complex than short polling with no benefit at this scale.

### 2. Photo Upload & Storage Strategy

**Decision**: File upload to local disk with a configurable upload directory; serve via FastAPI static files or reverse proxy.

**Rationale**:
- Constitution XII mandates server-side file type and size validation (max 10MB for photos).
- Local disk storage is the simplest approach and avoids adding S3/cloud storage dependencies in v1.
- Photos are served as static files through Traefik or Nginx in production.
- The upload path is configurable via environment variable (e.g., `UPLOAD_DIR`) for flexibility.
- If S3 is needed later, the storage layer can be swapped without changing the API contract.

**Alternatives considered**:
- S3/MinIO: Rejected for v1 — adds infrastructure complexity. Can be added later.
- Database BLOBs: Rejected — poor performance and storage efficiency for images.

### 3. Rich Text Editor for Team Introduction

**Decision**: Use a lightweight rich text editor (Tiptap) on the frontend; store content as HTML in the database.

**Rationale**:
- Tiptap is a headless, extensible editor built on ProseMirror with excellent React support.
- Storing as HTML is simple and renders directly in the public page without transformation.
- The team introduction is a single document — no need for a full CMS or block editor.
- HTML content is sanitized server-side before storage to prevent XSS.

**Alternatives considered**:
- Markdown: Rejected — less intuitive for non-technical admin users who need formatting (images, headings).
- Slate.js: Rejected — more complex API, less mature ecosystem.
- CKEditor/TinyMCE: Rejected — heavier bundle size, commercial licensing concerns.
- Store as JSON (ProseMirror document): Rejected — adds rendering complexity on the public side.

### 4. External Video Link Handling

**Decision**: Store video URLs as plain strings; validate URL format server-side; render as `<iframe>` embeds or clickable links on the frontend.

**Rationale**:
- Videos are hosted externally (Bilibili, Youku, etc.) — no upload or transcoding needed.
- URL validation prevents storing invalid data. Basic format check (valid URL) is sufficient.
- For known platforms (Bilibili, Youku), the frontend can convert share URLs to embed URLs for inline playback.
- For unknown platforms, display as a clickable external link.

**Alternatives considered**:
- oEmbed API integration: Rejected — adds external API dependency and complexity for minimal benefit.
- Platform-specific SDK embeds: Rejected — too coupled to specific platforms.

### 5. Player Privacy & Consent Flag Implementation

**Decision**: Boolean `has_parental_consent` field on the Player model. API serialization conditionally hides fields.

**Rationale**:
- Simple boolean flag is the minimum viable approach per the spec clarification.
- The backend API returns different response schemas based on consent: full profile (all fields) vs limited profile (first name + jersey number only).
- This is enforced at the API serialization layer — no photos or bios are ever sent to the client for non-consented players.
- Admin endpoints always return full data for management purposes.

**Alternatives considered**:
- Separate "public" and "private" profile tables: Rejected — over-engineered for a boolean distinction.
- Frontend-only filtering: Rejected — security risk; all data would be sent to the client.

### 6. Public vs Admin Route Architecture

**Decision**: New `_public` layout route for unauthenticated public pages, coexisting with existing `_layout` for authenticated admin pages.

**Rationale**:
- The existing `_layout` route requires authentication (`isLoggedIn()` check in `beforeLoad`).
- Public pages must be accessible without login.
- TanStack Router's file-based routing supports multiple layout routes natively.
- `_public/` handles: landing page, team intro, coach/player profiles, match schedule, match detail.
- `_layout/` (existing) handles: all admin CRUD pages, adding new routes for coaches, players, matches, team content.

**Alternatives considered**:
- Single layout with conditional auth: Rejected — mixes concerns, harder to reason about.
- Separate frontend app for public site: Rejected — over-engineered, duplicates shared code.

### 7. Database Indexing Strategy

**Decision**: Add indexes on frequently queried columns for new tables.

**Rationale**:
- Match table: index on `status` and `match_date` (for schedule queries filtering by status and sorting by date).
- MatchUpdate table: index on `match_id` + `created_at` (for chronological update queries per match).
- MatchMedia table: index on `match_id` (for media gallery queries per match).
- Coach/Player tables: no special indexes beyond primary key — small datasets with full-table reads.
- Constitution XII requires appropriate indexes and prohibits N+1 queries.

**Alternatives considered**:
- No indexes beyond PK: Rejected — match schedule queries would degrade as data grows.
- Full-text search indexes: Rejected — not needed for v1; match search is not a requirement.

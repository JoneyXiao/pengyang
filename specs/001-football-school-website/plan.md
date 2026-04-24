# Implementation Plan: Football School Team Website

**Branch**: `001-football-school-website` | **Date**: 2026-04-23 | **Spec**: [specs/001-football-school-website/spec.md](spec.md)
**Input**: Feature specification from `specs/001-football-school-website/spec.md`

## Summary

Build a public-facing football school team website for 深圳市龙华区观湖实验学校 with admin management capabilities. The site extends the existing FastAPI + React stack with new models (Coach, Player, Match, MatchUpdate, MatchMedia, TeamContent), new API endpoints, and new public/admin frontend pages. Public pages include landing, team intro, coach/player profiles, match schedule, and match detail (with real-time updates and media gallery). Admin pages provide CRUD for coaches, players, matches, match updates, media (photo uploads + external video links), and team intro content editing.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Alembic (backend); React, TanStack Router/Query, Vite, Tailwind CSS, shadcn/ui (frontend)
**Storage**: PostgreSQL (existing), local/S3 file storage for photo uploads
**Testing**: Pytest (backend), Playwright (frontend e2e)
**Target Platform**: Web (desktop + mobile browsers)
**Project Type**: Web application (backend API + frontend SPA)
**Performance Goals**: LCP < 2.5s, API p95 < 200ms, real-time updates within 10s
**Constraints**: JS bundle < 200KB gzipped initial route, photo upload max 10MB, Chinese (Simplified) UI
**Scale/Scope**: Hundreds of concurrent visitors, ~10 new pages/routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security & Secrets | ✅ PASS | Admin endpoints require JWT auth (existing). Player PII protected by consent flag. No new secrets needed. |
| II. API-First Contracts | ✅ PASS | New endpoints will be documented in OpenAPI. Client regenerated after schema changes. |
| III. Database Change Discipline | ✅ PASS | New models via SQLModel, Alembic migrations for all schema changes. |
| IV. Frontend-Backend Integration | ✅ PASS | Frontend will use generated client exclusively. No raw fetch. |
| V. Testing & Quality Gates | ✅ PASS | Each new endpoint gets happy-path + error-path tests. Playwright for key flows. |
| VI. Tooling & Quality | ✅ PASS | Ruff + biome + strict TypeScript. No new tooling. |
| VII. Reproducible Environments | ✅ PASS | Docker Compose already configured. No new services needed. |
| VIII. Spec-Driven Development | ✅ PASS | Working under specs/001-football-school-website/. |
| IX. MCP Servers | ✅ PASS | Will use available MCP servers for library docs. |
| X. Operability | ✅ PASS | Actionable errors, no silent failures. |
| XI. Design System (Swoosh Bold) | ✅ PASS | Public pages will follow DESIGN.md. Admin UI shares visual language. |
| XII. Performance | ✅ PASS | LCP < 2.5s target, lazy loading for images, indexed queries. |
| Article VI. Simplicity Gate | ✅ PASS | No unnecessary abstractions. Polling for real-time (not WebSockets). |
| Article VII. Anti-Abstraction Gate | ✅ PASS | Direct FastAPI/SQLModel/TanStack usage. No wrapper layers. |

**Gate result: ALL PASS** — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-football-school-website/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── models.py              # Add Coach, Player, Match, MatchUpdate, MatchMedia, TeamContent models
│   ├── crud.py                # Add CRUD functions for new models
│   ├── api/
│   │   ├── main.py            # Register new routers
│   │   └── routes/
│   │       ├── coaches.py     # Coach CRUD endpoints (admin)
│   │       ├── players.py     # Player CRUD endpoints (admin)
│   │       ├── matches.py     # Match CRUD + status endpoints (admin + public)
│   │       ├── match_updates.py  # Match live update endpoints (admin + public)
│   │       ├── match_media.py    # Photo upload + video link endpoints (admin + public)
│   │       ├── team_content.py   # Team intro content endpoints (admin + public)
│   │       └── public.py         # Public aggregate endpoints (landing page data)
│   └── alembic/
│       └── versions/          # New migration(s) for new tables
└── tests/
    └── api/routes/
        ├── test_coaches.py
        ├── test_players.py
        ├── test_matches.py
        ├── test_match_updates.py
        ├── test_match_media.py
        └── test_team_content.py

frontend/
├── src/
│   ├── routes/
│   │   ├── _public.tsx            # Public layout (no auth required)
│   │   ├── _public/
│   │   │   ├── index.tsx          # Landing page
│   │   │   ├── team.tsx           # Team introduction
│   │   │   ├── roster.tsx         # Coach & player profiles
│   │   │   ├── matches.tsx        # Match schedule
│   │   │   └── matches.$matchId.tsx  # Match detail (updates + media)
│   │   └── _layout/
│   │       ├── coaches.tsx        # Admin: coach management
│   │       ├── players.tsx        # Admin: player management
│   │       ├── matches.tsx        # Admin: match management
│   │       └── team-content.tsx   # Admin: team intro editor
│   ├── components/
│   │   ├── Public/               # Public page components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── MatchTimeline.tsx
│   │   │   └── MediaGallery.tsx
│   │   ├── Coaches/              # Admin coach components
│   │   ├── Players/              # Admin player components
│   │   └── Matches/              # Admin match components
│   └── client/                   # Regenerated from OpenAPI
└── tests/
    ├── public-pages.spec.ts
    └── match-management.spec.ts
```

**Structure Decision**: Existing web application structure (backend/ + frontend/) is reused. New routes added under both backend API routes and frontend file-based routes. Public pages use a new `_public` layout route that does not require authentication.

## Complexity Tracking

No constitution violations to justify — all gates pass.

# Tasks: Football School Team Website

**Input**: Design documents from `specs/001-football-school-website/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Add new dependencies and configuration for the feature

- [x] T001 Add UPLOAD_DIR setting and photo upload constraints (max 10MB, allowed types) to backend/app/core/config.py
- [x] T002 [P] Install Tiptap editor and extensions (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-image) in frontend/package.json
- [x] T003 [P] Add nh3 HTML sanitizer dependency to backend/pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database models, migration, shared infrastructure — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add TeamContent, Coach, Player, Match, MatchUpdate, MatchMedia SQLModel models and their Pydantic schemas (Create/Update/Public) to backend/app/models.py
- [x] T005 Create Alembic migration for all new tables (team_content, coach, player, match, matchupdate, matchmedia) with indexes per data-model.md in backend/app/alembic/versions/
- [x] T006 Add CRUD functions for all new models (team_content get/update, coach/player/match CRUD, match_update create/delete, match_media create/delete) to backend/app/crud.py
- [x] T007 Configure static file serving for the uploads directory in backend/app/main.py
- [x] T008 Seed initial TeamContent record with placeholder content in backend/app/initial_data.py
- [x] T009 Create all new API route files (public.py, team_content.py, coaches.py, players.py, matches.py, match_updates.py, match_media.py) with APIRouter objects and register them in backend/app/api/main.py
- [x] T010 [P] Create public layout route with responsive Navbar (site logo, nav links to all sections) in frontend/src/routes/_public.tsx and frontend/src/components/Public/Navbar.tsx
- [x] T011 [P] Update admin sidebar navigation with new links (球队介绍, 教练管理, 球员管理, 比赛管理) in frontend/src/components/Sidebar/AppSidebar.tsx

**Checkpoint**: Foundation ready — all models, migration, CRUD, route scaffolds, and layouts in place

---

## Phase 3: User Story 1 — Public Landing Page (Priority: P1) 🎯 MVP

**Goal**: Visitors see an engaging landing page with team branding, recent results, upcoming matches, and navigation

**Independent Test**: Navigate to `/` and verify school name, match highlights, upcoming schedule, and nav links render correctly

- [x] T012 [US1] Implement GET /api/v1/public/landing endpoint (returns upcoming_matches, recent_matches, team_name) in backend/app/api/routes/public.py
- [x] T013 [US1] Regenerate frontend client via scripts/generate-client.sh
- [x] T014 [P] [US1] Create HeroSection component (school name 深圳市龙华区观湖实验学校, team branding, hero image) in frontend/src/components/Public/HeroSection.tsx
- [x] T015 [P] [US1] Create MatchCard component (date, teams, score, status badge) in frontend/src/components/Public/MatchCard.tsx
- [x] T016 [US1] Implement landing page route using HeroSection, MatchCard, and nav links in frontend/src/routes/_public/index.tsx

**Checkpoint**: Landing page renders with team branding, match highlights, and working navigation

---

## Phase 4: User Story 2 — Team Introduction Page (Priority: P1)

**Goal**: Visitors read the team's history, philosophy, achievements; admins edit content via rich text editor

**Independent Test**: Navigate to `/team` and verify rich text content renders; admin can edit at `/team-content`

- [x] T017 [US2] Implement GET /api/v1/public/team-content endpoint in backend/app/api/routes/public.py
- [x] T018 [P] [US2] Implement GET and PUT /api/v1/team-content admin endpoints (with nh3 HTML sanitization on PUT) in backend/app/api/routes/team_content.py
- [x] T019 [US2] Regenerate frontend client via scripts/generate-client.sh
- [x] T020 [P] [US2] Implement public team introduction page (renders sanitized HTML content) in frontend/src/routes/_public/team.tsx
- [x] T021 [P] [US2] Implement admin team content editor page with Tiptap rich text editor in frontend/src/routes/_layout/team-content.tsx
- [x] T049 [P] [US2] Write backend tests (happy-path + error-path) for team_content endpoints in backend/tests/api/routes/test_team_content.py

**Checkpoint**: Public team page renders rich content; admin can edit and save via Tiptap editor

---

## Phase 5: User Story 3 — Coach & Player Profiles (Priority: P1)

**Goal**: Visitors browse coach/player profiles; players without consent show limited info; admins manage profiles via CRUD

**Independent Test**: Navigate to `/roster` and verify coaches show full profiles, consented players show full profiles, non-consented players show only first name and jersey number

- [x] T022 [US3] Implement public coaches and public players (consent-filtered) endpoints in backend/app/api/routes/public.py
- [x] T023 [P] [US3] Implement coach admin CRUD endpoints (POST multipart, GET, PATCH multipart, DELETE) in backend/app/api/routes/coaches.py
- [x] T024 [P] [US3] Implement player admin CRUD endpoints (POST multipart with consent flag, GET full data, PATCH, DELETE) in backend/app/api/routes/players.py
- [x] T025 [US3] Regenerate frontend client via scripts/generate-client.sh
- [x] T026 [P] [US3] Create ProfileCard component (photo, name, role/position, bio; limited variant for no-consent players) in frontend/src/components/Public/ProfileCard.tsx
- [x] T027 [US3] Implement public roster page (coaches section + players section using ProfileCard) in frontend/src/routes/_public/roster.tsx
- [x] T028 [P] [US3] Implement admin coaches management page (list, add, edit, delete with photo upload) in frontend/src/routes/_layout/coaches.tsx
- [x] T029 [P] [US3] Implement admin players management page (list, add, edit, delete with photo upload and consent toggle) in frontend/src/routes/_layout/players.tsx
- [x] T050 [P] [US3] Write backend tests (happy-path + error-path) for coaches endpoints in backend/tests/api/routes/test_coaches.py
- [x] T051 [P] [US3] Write backend tests (happy-path + error-path) for players endpoints in backend/tests/api/routes/test_players.py

**Checkpoint**: All P1 stories complete — public site has landing page, team intro, and roster; admin can manage team content, coaches, and players

---

## Phase 6: User Story 4 — Admin Match Management (Priority: P2)

**Goal**: Admins create, edit, delete matches and toggle status (upcoming/live/completed)

**Independent Test**: Admin logs in, creates a match with date/time/teams/precautions, changes status to live, then completed

- [x] T030 [US4] Implement match admin CRUD endpoints (POST, GET list, PATCH with status toggle, DELETE) in backend/app/api/routes/matches.py
- [x] T031 [US4] Regenerate frontend client via scripts/generate-client.sh
- [x] T032 [US4] Implement admin matches management page (list with status filters, create/edit form, status toggle, delete) in frontend/src/routes/_layout/matches.tsx
- [x] T052 [P] [US4] Write backend tests (happy-path + error-path) for matches endpoints in backend/tests/api/routes/test_matches.py

**Checkpoint**: Admin can fully manage matches — create, edit, delete, and toggle status

---

## Phase 7: User Story 5 — Real-Time Match Updates (Priority: P2)

**Goal**: Admins post live text updates during a match; public visitors see updates auto-refresh via polling

**Independent Test**: Admin posts an update to a live match; public match detail page shows the update within 10 seconds without manual refresh

- [x] T033 [P] [US5] Implement POST and DELETE /api/v1/matches/{id}/updates admin endpoints in backend/app/api/routes/match_updates.py
- [x] T034 [P] [US5] Implement GET /api/v1/public/matches/{id}/updates polling endpoint (with ?after= timestamp filter) in backend/app/api/routes/public.py
- [x] T035 [US5] Regenerate frontend client via scripts/generate-client.sh
- [x] T036 [US5] Create MatchTimeline component with TanStack Query 5-second refetchInterval polling in frontend/src/components/Public/MatchTimeline.tsx
- [x] T037 [US5] Add match updates management UI (post new update, list existing, delete) to admin match detail in frontend/src/routes/_layout/matches.tsx
- [x] T053 [P] [US5] Write backend tests (happy-path + error-path) for match_updates endpoints in backend/tests/api/routes/test_match_updates.py

**Checkpoint**: Real-time updates flow from admin to public page within 10 seconds via polling

---

## Phase 8: User Story 6 — Match Photos & Video Links (Priority: P2)

**Goal**: Admins upload photos and add external video links to matches; public visitors browse media gallery

**Independent Test**: Admin uploads a photo and adds a Bilibili video link to a match; public match detail page shows the photo gallery and embedded/linked video

- [x] T038 [US6] Implement match media endpoints (POST photo upload with file validation and progress-compatible streaming response, POST video link with URL validation, DELETE) in backend/app/api/routes/match_media.py
- [x] T039 [US6] Regenerate frontend client via scripts/generate-client.sh
- [x] T040 [US6] Create MediaGallery component (photo grid/carousel + video embed/link rendering for Bilibili/Youku) in frontend/src/components/Public/MediaGallery.tsx
- [x] T041 [US6] Add media management UI (photo upload with progress, video link form, media list with delete) to admin match detail in frontend/src/routes/_layout/matches.tsx
- [x] T054 [P] [US6] Write backend tests (happy-path + error-path) for match_media endpoints in backend/tests/api/routes/test_match_media.py

**Checkpoint**: Match media flows from admin upload/link to public gallery display

---

## Phase 9: User Story 7 — Public Match Schedule & Details (Priority: P2)

**Goal**: Visitors browse match schedule (upcoming/past) and view full match details with updates and media

**Independent Test**: Navigate to `/matches`, see sorted match list; click a match to see full detail with date/teams/precautions/updates/media

- [x] T042 [US7] Implement GET /api/v1/public/matches (with status filter, pagination) and GET /api/v1/public/matches/{id} (with updates + media) endpoints in backend/app/api/routes/public.py
- [x] T043 [US7] Regenerate frontend client via scripts/generate-client.sh
- [x] T044 [US7] Implement public match schedule page (sorted list, upcoming/completed tabs, empty state) in frontend/src/routes/_public/matches.tsx
- [x] T045 [US7] Implement public match detail page (match info, MatchTimeline, MediaGallery integration) in frontend/src/routes/_public/matches.$matchId.tsx

**Checkpoint**: All P2 stories complete — full match lifecycle from admin creation to public viewing with live updates and media

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Quality, consistency, and verification across all stories

- [x] T046 [P] Add loading skeletons, empty states, and error boundaries across all public pages in frontend/src/routes/_public/
- [x] T047 [P] Ensure all pages are responsive (mobile 320px+, tablet, desktop) per DESIGN.md breakpoints in frontend/src/routes/_public/
- [x] T055 [P] Configure image optimization (WebP/AVIF format, responsive sizes attributes, eager loading for hero, lazy loading for below-fold) and font loading (Google Fonts display=swap, preload Jost 700/900 and Inter 400/500) per Constitution XII and DESIGN.md
- [x] T056 [P] Verify all user-facing text is in Simplified Chinese across all public and admin pages per FR-014
- [x] T057 Verify all admin endpoints reject unauthenticated requests and return 401/403 (auth guard verification for SC-008 and FR-012 compliance)
- [x] T048 Run quickstart.md verification checklist to validate all features end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 Landing Page (Phase 3)**: Depends on Phase 2
- **US2 Team Intro (Phase 4)**: Depends on Phase 2; independent of US1
- **US3 Coach/Player (Phase 5)**: Depends on Phase 2; independent of US1, US2
- **US4 Match Management (Phase 6)**: Depends on Phase 2; independent of P1 stories
- **US5 Match Updates (Phase 7)**: Depends on Phase 6 (needs matches to exist)
- **US6 Match Media (Phase 8)**: Depends on Phase 6 (needs matches to exist)
- **US7 Public Matches (Phase 9)**: Depends on Phase 6; integrates US5 + US6 components
- **Polish (Phase 10)**: Depends on all desired stories being complete

### User Story Independence

```
Phase 2 (Foundational)
├── US1 (P1) ──────────────── can start immediately after Phase 2
├── US2 (P1) ──────────────── can start immediately after Phase 2
├── US3 (P1) ──────────────── can start immediately after Phase 2
└── US4 (P2) ──────────────── can start immediately after Phase 2
    ├── US5 (P2) ──────────── depends on US4
    ├── US6 (P2) ──────────── depends on US4
    └── US7 (P2) ──────────── depends on US4; integrates US5 + US6
```

- **P1 stories (US1, US2, US3)**: Fully independent — can run in any order or in parallel
- **P2 stories**: US4 must come first; US5, US6 can run in parallel after US4; US7 should come last (integrates all)

### Within Each User Story

1. Backend endpoint implementation
2. Backend tests (happy-path + error-path per Constitution V)
3. Regenerate frontend client
4. Frontend component creation (parallelizable)
5. Frontend page/route assembly

### Parallel Opportunities per Story

**US1**: HeroSection [P] and MatchCard [P] can be built simultaneously
**US2**: Public team page [P] and admin editor [P] can be built simultaneously
**US3**: Coach endpoints [P], player endpoints [P] can be built simultaneously; admin coaches page [P] and admin players page [P] simultaneously
**US5**: Admin update endpoints [P] and public polling endpoint [P] simultaneously
**US7**: Match schedule page and match detail page are sequential (detail depends on schedule for navigation)

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Landing Page
4. **STOP and VALIDATE**: Landing page renders with branding and navigation
5. Complete Phase 4: US2 — Team Introduction
6. Complete Phase 5: US3 — Coach/Player Profiles
7. **DEPLOY MVP**: Public site with landing, team intro, and roster

### Incremental Delivery (Add P2 Stories)

8. Complete Phase 6: US4 — Match Management (admin)
9. Complete Phase 7: US5 — Real-Time Updates
10. Complete Phase 8: US6 — Match Media
11. Complete Phase 9: US7 — Public Match Pages
12. Complete Phase 10: Polish
13. **DEPLOY FULL**: Complete site with all features

### Notes

- Commit after each task or logical group
- Each story checkpoint is a valid demo/deploy point
- P1 stories deliver a static informational site (landing + team + roster)
- P2 stories add dynamic match content (schedule, live updates, media)

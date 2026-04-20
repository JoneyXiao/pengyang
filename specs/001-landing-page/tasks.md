# Tasks: Landing Page

**Input**: Design documents from `specs/001-landing-page/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Constitution Principle II mandates tests for critical user paths. Test tasks are included in Phase 9.

**Organization**: Tasks are grouped by user story. US1 & US2 (both P1) are combined into one phase since they cover mobile and desktop views of the same page — they share all components and differ only in responsive behavior.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project, configure Tailwind, shadcn/ui, fonts, and design tokens

- [x] T001 Initialize Next.js App Router project with TypeScript strict mode in `src/` directory
- [x] T002 Initialize shadcn/ui with Tailwind CSS and configure `components.json`
- [x] T003 [P] Configure Noto Sans SC font via `next/font/google` in `src/app/layout.tsx` with weights 400/500/700/900 and `--font-noto-sans-sc` CSS variable
- [x] T004 [P] Configure design system CSS custom properties (shadcn/ui HSL variables from DESIGN.md color mapping) in `src/app/globals.css`
- [x] T005 [P] Define TypeScript types (`Match`, `MatchStatus`, `TeamProfile`, `NavItem`) in `src/lib/types/index.ts`
- [x] T006 [P] Create centralized Chinese locale strings module in `src/lib/constants/locale.ts`
- [x] T007 [P] Create mock match fixture data (6+ matches covering all statuses) in `src/data/fixtures/matches.json`
- [x] T008 [P] Create mock team profile fixture data in `src/data/fixtures/team.json`

**Checkpoint**: Project builds, `pnpm dev` runs, warm-white canvas renders at `/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data layer and shared UI primitives that ALL user story sections depend on

**⚠️ CRITICAL**: No section component work can begin until this phase is complete

- [x] T009 Implement `getUpcomingMatches()`, `getRecentResults()`, `getLiveMatches()` reading from JSON fixtures in `src/lib/data/matches.ts`
- [x] T010 [P] Implement `getTeamProfile()` reading from JSON fixture in `src/lib/data/team.ts`
- [x] T011 [P] Add shadcn/ui `Button` component via CLI to `src/components/ui/`
- [x] T012 [P] Add shadcn/ui `Sheet` component via CLI to `src/components/ui/` (needed for mobile nav)
- [x] T013 [P] Create `StatusBadge` component with live/upcoming/completed/cancelled variants (including pulsing dot animation for live) in `src/components/ui/status-badge.tsx`
- [x] T014 [P] Create `MatchCard` component displaying both team names (Pengyang first), score in monospace, date, venue, status badge, clickable link to `/matches/{id}`, hover lift animation in `src/components/ui/match-card.tsx`
- [x] T015 [P] Create `EmptyState` component for sections with no data in `src/components/landing/empty-state.tsx`

**Checkpoint**: Data functions return typed mock data, UI primitives render correctly in isolation

---

## Phase 3: User Story 1 & 2 — Full Landing Page (Mobile + Desktop) (Priority: P1) 🎯 MVP

**Goal**: A visitor on any device sees the complete landing page: hero, upcoming matches, recent results, team introduction, navigation, and footer — all responsive from 320px to 1440px+.

**Independent Test**: Open `/` at 375px (mobile) and 1280px (desktop). Verify all 6 sections render, hero photo loads with overlay text, match cards display in 1-column (mobile) / 3-column (desktop) grids, nav collapses to hamburger on mobile, footer renders with dark background.

### Implementation

- [x] T016 [P] [US1] Create `HeroSection` component with full-width image, gradient overlay, team name (48px/900 desktop → 32px mobile), tagline, and "查看赛程" CTA button in `src/components/landing/hero-section.tsx`
- [x] T017 [P] [US1] Create `MatchesSection` component rendering up to 3 upcoming match cards in responsive grid (1-col mobile, 2-col tablet, 3-col desktop) with section heading and "查看赛程" link in `src/components/landing/matches-section.tsx`
- [x] T018 [P] [US1] Create `ResultsSection` component rendering up to 3 recent result cards in responsive grid with section heading in `src/components/landing/results-section.tsx`
- [x] T019 [P] [US1] Create `TeamIntroSection` component with heading, description paragraph, team photo via `next/image`, and "了解更多" link in `src/components/landing/team-intro-section.tsx`
- [x] T020 [P] [US1] Create `SiteHeader` component with sticky nav bar, team badge, "鹏飏足球" wordmark, horizontal nav links (desktop), and hamburger trigger (mobile) in `src/components/layout/site-header.tsx`
- [x] T021 [P] [US1] Create `MobileNavSheet` client component with slide-in sheet, stacked nav links (48px row height), close behavior in `src/components/layout/mobile-nav-sheet.tsx`
- [x] T022 [P] [US1] Create `SiteFooter` component with dark background (`zinc-900`), school name, team badge, quick links, contact info, copyright in `src/components/layout/site-footer.tsx`
- [x] T023 [US1] Define navigation items array and wire into `SiteHeader` and `SiteFooter` in `src/lib/constants/locale.ts`
- [x] T024 [US1] Compose root layout with fonts, metadata (`lang="zh-CN"`), `SiteHeader`, and `SiteFooter` wrapping `{children}` in `src/app/layout.tsx`
- [x] T025 [US1] Compose landing page assembling all sections with ISR (`export const revalidate = 60`), data fetching via `getUpcomingMatches`, `getRecentResults`, `getLiveMatches`, `getTeamProfile` in `src/app/page.tsx`
- [x] T026 [US2] Verify and refine responsive behavior: hero stacks image above text on mobile, match grids reflow to single column, nav collapses, footer stacks — adjust Tailwind responsive classes across all section components
- [x] T027 [US1] Create loading skeleton for the landing page in `src/app/loading.tsx`

**Checkpoint**: Full landing page renders at `/` on both mobile (375px) and desktop (1280px). All 6 sections visible, match cards populated from fixtures, navigation works, hero displays with overlay.

---

## Phase 4: User Story 3 — Quick Access to Match Schedule (Priority: P2)

**Goal**: Upcoming matches are clearly surfaced with date, time, venue, opponent, and status. A "查看赛程" link navigates to the full schedule page.

**Independent Test**: Load `/` and verify the upcoming-matches section shows the next 3 scheduled matches with all required data fields. Verify the "查看赛程" link points to `/schedule`. Verify empty state displays when no upcoming matches exist.

### Implementation

- [x] T028 [US3] Ensure `MatchesSection` handles empty state — renders `EmptyState` with "暂无赛事安排" message when `matches` array is empty in `src/components/landing/matches-section.tsx`
- [x] T029 [US3] Ensure `MatchCard` displays date formatted in Chinese locale, venue text, and match time for upcoming matches in `src/components/ui/match-card.tsx`
- [x] T030 [US3] Verify and refine "查看赛程" link in `MatchesSection` — ensure it points to `/schedule` with correct styling and hover state in `src/components/landing/matches-section.tsx`

**Checkpoint**: Upcoming matches section works with data and without (empty state). "查看赛程" link is visible and navigable.

---

## Phase 5: User Story 4 — View Recent Match Results (Priority: P2)

**Goal**: Recent completed matches display with scores in monospace font, both team names, and completed status badges.

**Independent Test**: Load `/` with completed matches in fixtures. Verify scores render in monospace font, team names show Pengyang first, status badge says "已完成". Verify empty state when no completed matches exist.

### Implementation

- [x] T031 [US4] Ensure `ResultsSection` handles empty state — renders `EmptyState` with "暂无比赛结果" message or hides section when `matches` array is empty in `src/components/landing/results-section.tsx`
- [x] T032 [US4] Ensure `MatchCard` renders scores in `font-mono` (system monospace) with proper alignment (e.g., "3 : 1") for completed and live matches in `src/components/ui/match-card.tsx`
- [x] T033 [US4] Ensure live matches in the upcoming or results sections display the `StatusBadge` with pulsing red dot and link to match detail in `src/components/ui/match-card.tsx`

**Checkpoint**: Results section renders completed matches with monospace scores, live matches show pulsing badge, empty state works.

---

## Phase 6: User Story 5 — Discover Team Identity and Photos (Priority: P3)

**Goal**: Team introduction section conveys Pengyang's identity with descriptive text, action photography, and a link to the full team page.

**Independent Test**: Load `/` and verify the team introduction section displays heading "关于我们", description text, team photo via `next/image` with blur placeholder, and "了解更多" link to `/team`.

### Implementation

- [x] T034 [US5] Ensure `TeamIntroSection` uses `next/image` with `placeholder="blur"`, responsive `sizes` attribute, and proper aspect ratio for team photo in `src/components/landing/team-intro-section.tsx`
- [x] T035 [US5] Verify "了解更多" link in `TeamIntroSection` navigates to `/team` with correct styling in `src/components/landing/team-intro-section.tsx`
- [x] T036 [US5] Handle missing team photo (null `teamPhotoUrl`) with a graceful fallback in `src/components/landing/team-intro-section.tsx`

**Checkpoint**: Team intro section renders with photo, description, and navigation link. Fallback works when photo is absent.

---

## Phase 7: User Story 6 — Navigate via Footer (Priority: P3)

**Goal**: Footer provides alternative navigation, school identity, and contact info on a dark background.

**Independent Test**: Scroll to page bottom. Verify dark background, school name, team badge, quick links (赛程, 球队介绍, 相册), contact info, and copyright. On mobile, content stacks vertically with tappable links.

### Implementation

- [x] T037 [US6] Ensure `SiteFooter` renders quick links from `navItems`, school full name, and copyright year in `src/components/layout/site-footer.tsx`
- [x] T038 [US6] Ensure `SiteFooter` responsive layout: multi-column on desktop, stacked on mobile, all links meet 44px touch target on mobile in `src/components/layout/site-footer.tsx`
- [x] T039 [US6] Add team badge image via `next/image` in the footer in `src/components/layout/site-footer.tsx`

**Checkpoint**: Footer renders correctly on all viewports with dark background, all links tappable, badge visible.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Hero fallback, accessibility, performance, and final validation

- [x] T040 [P] Implement hero fallback — when `heroImageUrl` is null, render solid Pitch Green background with team name and tagline in `src/components/landing/hero-section.tsx`
- [x] T041 [P] Add semantic HTML landmarks: `<nav>` for header/footer nav, `<main>` wrapping page content, `<header>` for site header, `<footer>` for site footer across layout components
- [x] T042 [P] Ensure all interactive elements have visible focus ring (`ring-primary` / `ring-offset`) for keyboard navigation across all components
- [x] T043 [P] Add `<Image priority>` to hero image for LCP optimization, verify responsive `sizes` attributes on all `next/image` instances in `src/components/landing/hero-section.tsx`
- [x] T044 [P] Add page metadata (`title`, `description`, Open Graph) via Next.js `generateMetadata` or static `metadata` export in `src/app/layout.tsx` or `src/app/page.tsx`
- [x] T045 Run quickstart.md validation — verify `pnpm dev` starts, `/` renders all sections, responsive behavior works at 320px/640px/1024px/1280px

---

## Phase 9: Tests (Constitution Principle II)

**Purpose**: Unit and component tests covering critical user paths per Constitution Principle II

**⚠️ CRITICAL**: Constitution mandates "Every feature MUST include tests that cover the critical user path." Tests MUST NOT depend on network access — all external dependencies are mocked via JSON fixtures.

- [x] T046 [P] Write unit tests for `getUpcomingMatches()`, `getRecentResults()`, `getLiveMatches()` — verify filtering by status, sorting by date, limit parameter, and empty-array return in `src/__tests__/lib/matches.test.ts`
- [x] T047 [P] Write component test for `MatchCard` — verify both team names rendered (Pengyang first), monospace score display for completed matches, status badge presence, clickable link to `/matches/{id}`, and hover lift animation in `src/__tests__/components/match-card.test.tsx`
- [x] T048 [P] Write component test for `StatusBadge` — verify all 4 variants (upcoming/live/completed/cancelled) render correct text and styles, live variant has pulsing dot animation class in `src/__tests__/components/status-badge.test.tsx`
- [x] T049 [P] Write component test for `HeroSection` — verify hero image renders with priority, gradient overlay present, team name and tagline displayed, CTA button links to `/schedule`, and green fallback when `heroImageUrl` is null in `src/__tests__/components/hero-section.test.tsx`
- [x] T050 [P] Write component test for `SiteHeader` — verify desktop nav links rendered horizontally, hamburger trigger visible on mobile viewport, team badge and wordmark present in `src/__tests__/components/site-header.test.tsx`

**Checkpoint**: All tests pass via `pnpm test`. Tests run without network access. Coverage includes data layer logic and all interactive UI components.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001, T002, T005, T007, T008 from Setup — BLOCKS all user stories
- **User Stories 1 & 2 (Phase 3)**: Depends on Phase 2 completion — the MVP
- **User Story 3 (Phase 4)**: Depends on Phase 3 (refines MatchesSection created in Phase 3)
- **User Story 4 (Phase 5)**: Depends on Phase 3 (refines ResultsSection and MatchCard from Phase 3)
- **User Story 5 (Phase 6)**: Depends on Phase 3 (refines TeamIntroSection from Phase 3)
- **User Story 6 (Phase 7)**: Depends on Phase 3 (refines SiteFooter from Phase 3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete
- **Tests (Phase 9)**: Depends on Phase 8 — tests validate the final implementation

### User Story Dependencies

- **US1 & US2 (P1)**: Can start after Phase 2 — creates all section components
- **US3 (P2)**: Refines MatchesSection from US1 — depends on T017
- **US4 (P2)**: Refines ResultsSection/MatchCard from US1 — depends on T018, T014
- **US5 (P3)**: Refines TeamIntroSection from US1 — depends on T019
- **US6 (P3)**: Refines SiteFooter from US1 — depends on T022
- **US3 and US4 can run in parallel** (different components)
- **US5 and US6 can run in parallel** (different components)

### Within Each User Story

- Section components before page composition
- Page composition (T025) after all section components
- Responsive refinement (T026) after page composition

### Parallel Opportunities

**Phase 1** (6 parallel tasks): T003, T004, T005, T006, T007, T008 can all run in parallel after T001+T002

**Phase 2** (6 parallel tasks): T010, T011, T012, T013, T014, T015 can all run in parallel; T009 depends on T005+T007

**Phase 3** (7 parallel tasks): T016, T017, T018, T019, T020, T021, T022 can all run in parallel before composition step T025

**Phase 8** (5 parallel tasks): T040, T041, T042, T043, T044 can all run in parallel

**Phase 9** (5 parallel tasks): T046, T047, T048, T049, T050 can all run in parallel

---

## Parallel Example: Phase 3 (MVP)

```
# Launch all section components in parallel:
T016: HeroSection in src/components/landing/hero-section.tsx
T017: MatchesSection in src/components/landing/matches-section.tsx
T018: ResultsSection in src/components/landing/results-section.tsx
T019: TeamIntroSection in src/components/landing/team-intro-section.tsx
T020: SiteHeader in src/components/layout/site-header.tsx
T021: MobileNavSheet in src/components/layout/mobile-nav-sheet.tsx
T022: SiteFooter in src/components/layout/site-footer.tsx

# Then sequentially:
T023: Wire navigation items
T024: Compose root layout
T025: Compose landing page with data fetching + ISR
T026: Verify responsive behavior
T027: Loading skeleton
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001–T008)
2. Complete Phase 2: Foundational (T009–T015)
3. Complete Phase 3: User Stories 1 & 2 (T016–T027)
4. **STOP and VALIDATE**: Full landing page renders on mobile and desktop with all sections
5. Deploy/demo if ready

### Incremental Delivery

6. Phase 4: US3 — Refine match schedule access (T028–T030)
7. Phase 5: US4 — Refine match results display (T031–T033)
8. Phase 6: US5 — Refine team identity section (T034–T036)
9. Phase 7: US6 — Refine footer navigation (T037–T039)
10. Phase 8: Polish & accessibility (T040–T045)
11. Phase 9: Tests (T046–T050)

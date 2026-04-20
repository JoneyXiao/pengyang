# Feature Specification: Landing Page

**Feature Branch**: `001-landing-page`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Build the landing page for mobile users and desktop users."

## Clarifications

### Session 2026-04-19

- Q: Does the landing page need real-time live match score updates, or just a static live badge? → A: Badge-only — the landing page shows a "Live" status badge on in-progress matches, linking to the match detail page for real-time updates. No real-time score polling on the landing page.
- Q: Should the landing page use ISR, SSR, or full static generation for match data? → A: ISR with short revalidation (~60 seconds). Page is statically served and rebuilt in the background periodically for near-fresh data with excellent performance.
- Q: What is the top-to-bottom section order on the landing page? → A: Hero → Upcoming Matches → Recent Results → Team Introduction → Footer.
- Q: Should match cards show both team names or just the opponent? → A: Both teams — "鹏飏 vs 对手学校" with Pengyang always listed first.
- Q: Should the landing page be built against mock data first or depend on EdgeOne KV from the start? → A: Mock-first — build with local seed data/fixtures, integrate with EdgeOne KV later. This decouples frontend from backend and keeps tests reliable.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Team Overview on Mobile (Priority: P1)

A parent opens the Pengyang Football website on their phone during a school pickup. They immediately see a hero section with an action photo of the team, the team name "鹏飏足球," and a clear tagline. Below the hero they find upcoming match information, recent results, and a brief team introduction — all without scrolling excessively or pinching to zoom.

**Why this priority**: Mobile is the primary access device for parents, students, and the school community. If the landing page doesn't work well on phones, the majority of users are lost.

**Independent Test**: Open the landing page on a 375px-wide viewport (iPhone SE). Verify the hero image loads, team name and tagline are legible, upcoming matches are visible after one scroll, and all touch targets are at least 44px tall.

**Acceptance Scenarios**:

1. **Given** a visitor on a mobile device, **When** they open the landing page, **Then** they see a full-width hero image with the team name and tagline overlaid, readable without zooming.
2. **Given** a visitor on a mobile device, **When** they scroll past the hero, **Then** they see a section of upcoming matches displayed as single-column cards with match date, opponents, and status badges.
3. **Given** a visitor on a mobile device, **When** they tap the hamburger menu icon, **Then** a slide-in navigation sheet appears with links to all major sections (e.g., 球队介绍, 赛程, 相册), each with a 48px-tall touch target.

---

### User Story 2 — View Team Overview on Desktop (Priority: P1)

A visiting coach or school administrator opens the Pengyang Football website on a desktop browser. They see a visually striking hero section, a multi-column grid of upcoming and recent matches, a team introduction section with photography, and easy navigation to deeper pages. The page feels professional yet playful.

**Why this priority**: Desktop visitors (coaches, administrators, prospective parents) form first impressions quickly. A well-structured desktop layout builds credibility.

**Independent Test**: Open the landing page at 1280px viewport width. Verify the hero fills the viewport width, match cards display in a 3-column grid, the navigation bar shows all links horizontally, and the page maxes out at 1200px content width.

**Acceptance Scenarios**:

1. **Given** a visitor on a desktop browser, **When** they open the landing page, **Then** they see a hero section with a 16:9 match action photo, the team name in large display type, a tagline, and a primary call-to-action button.
2. **Given** a visitor on a desktop browser, **When** they scroll to the matches section, **Then** upcoming matches appear in a responsive multi-column grid (2 columns on tablet, 3 on desktop).
3. **Given** a visitor on a desktop browser, **When** they view the navigation bar, **Then** all primary nav links are visible horizontally without a hamburger menu.

---

### User Story 3 — Quick Access to Match Schedule (Priority: P2)

A parent wants to quickly check when the next match is and where it will be held. From the landing page, they can see the nearest upcoming match prominently featured and can navigate to the full schedule with a single tap or click.

**Why this priority**: Match schedules are the most frequently sought information on the site. Surfacing the next match on the landing page reduces friction.

**Independent Test**: Load the landing page and verify the upcoming-matches section shows at least the next scheduled match with date, time, venue, and opponent. Verify a "查看赛程" link or button navigates to the full schedule page.

**Acceptance Scenarios**:

1. **Given** upcoming matches exist, **When** a visitor views the landing page, **Then** the next 3 upcoming matches are displayed with date, opponent, venue, and an "Upcoming" status badge.
2. **Given** a visitor sees the matches section, **When** they click "查看赛程," **Then** they are navigated to the full match schedule page.
3. **Given** no upcoming matches exist, **When** a visitor views the landing page, **Then** a friendly message is displayed (e.g., "暂无赛事安排") instead of an empty section.

---

### User Story 4 — View Recent Match Results (Priority: P2)

A parent or student wants to see how recent matches went. The landing page displays the latest completed match results with scores, so visitors can celebrate wins and stay informed.

**Why this priority**: Recent results keep the community engaged and give the landing page dynamic, frequently updated content.

**Independent Test**: Load the landing page with at least one completed match in the system. Verify the results section shows match scores in monospace font, team names, date, and a "Completed" status badge.

**Acceptance Scenarios**:

1. **Given** completed matches exist, **When** a visitor views the landing page, **Then** the most recent 3 completed matches are displayed with team names, scores, date, and status badge.
2. **Given** a match result is displayed, **When** the visitor views the score, **Then** the score is rendered in monospace font for clarity.
3. **Given** no completed matches exist, **When** a visitor views the landing page, **Then** the recent results section is hidden or shows a contextual message.

---

### User Story 5 — Discover Team Identity and Photos (Priority: P3)

A first-time visitor (e.g., a prospective parent or opposing team) wants to understand who Pengyang Football is. The landing page includes a brief team introduction section with descriptive text and action photography that conveys the team's spirit.

**Why this priority**: Team identity content is important for first impressions but is less frequently accessed than match information.

**Independent Test**: Load the landing page and verify a team introduction section exists with a heading, a short paragraph of text, at least one team photo, and a link to the full team page.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** they scroll to the team introduction section, **Then** they see a heading (e.g., "关于我们"), a brief paragraph about the team, and an action photo.
2. **Given** a visitor views the team introduction, **When** they click "了解更多," **Then** they are navigated to the full team introduction page.

---

### User Story 6 — Navigate via Footer (Priority: P3)

A visitor scrolling to the bottom of the landing page finds a footer with the school name, team badge, quick links to key pages, and contact information. The footer provides an alternative navigation path and establishes credibility.

**Why this priority**: The footer is a standard navigational affordance and completes the page structure, but is lower priority than hero and content sections.

**Independent Test**: Scroll to the bottom of the landing page. Verify the footer has a dark background, displays the school name and team badge, includes quick links, and shows contact information.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the page bottom, **When** they view the footer, **Then** they see the school name, team badge, quick links (赛程, 球队介绍, 相册), and contact information on a dark background.
2. **Given** a visitor is on mobile, **When** they view the footer, **Then** the footer content stacks vertically and all links are tappable.

---

### Edge Cases

- What happens when there are no matches (neither upcoming nor completed) in the system? The landing page should still render a complete, visually balanced layout with contextual empty-state messages and the team introduction section as the primary content.
- What happens when hero photography is not yet uploaded? A fallback solid-color hero with the team name and tagline should display, using Pitch Green as the background.
- What happens on extremely narrow viewports (320px)? All content must remain readable, touch targets must remain at least 44px, and no horizontal overflow should occur.
- What happens on very wide viewports (> 1440px)? Content remains centered within the 1200px max-width container with expanding margins.
- What happens if the page is accessed with JavaScript disabled? The hero image, navigation, team introduction, and footer should still be visible via server-rendered HTML. Match data sections may show a loading placeholder.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page MUST display a full-width hero section with a match action photo, the team name "鹏飏足球," a tagline, and a primary call-to-action button linking to the match schedule.
- **FR-002**: The landing page MUST display an upcoming-matches section showing up to 3 next scheduled matches with both team names (Pengyang listed first, e.g., "鹏飏 vs 对手学校"), date, venue, and status badge.
- **FR-003**: The landing page MUST display a recent-results section showing up to 3 most recent completed matches with both team names (Pengyang first), scores, date, and status badge.
- **FR-004**: The landing page MUST display a team introduction section with a heading, descriptive text, at least one team photo, and a link to the full team page.
- **FR-005**: The landing page MUST include a sticky top navigation bar with the team logo, wordmark, and links to major sections (赛程, 球队介绍, 相册).
- **FR-006**: The landing page MUST include a footer with the school name, team badge, quick links, contact information (school address and general email as hardcoded placeholder text for v1), and copyright on a dark background.
- **FR-007**: The landing page MUST be fully responsive from 320px to 1440px+ viewport width, following the mobile-first breakpoint system (mobile < 640px, tablet 640–1023px, desktop ≥ 1024px).
- **FR-008**: All match cards MUST be interactive — tapping or clicking a match card navigates to the match detail page.
- **FR-009**: On mobile (< 1024px), the navigation MUST collapse to a hamburger icon that opens a slide-in sheet with stacked navigation links.
- **FR-010**: The hero section MUST use a bottom-edge gradient overlay on the photo to ensure text legibility.
- **FR-011**: Match scores MUST be displayed in monospace font to ensure alignment and readability.
- **FR-012**: All images MUST use optimized loading with blur placeholders and responsive sizing.
- **FR-013**: The landing page MUST show graceful empty states when no match data is available.
- **FR-014**: All interactive elements MUST have visible focus indicators for keyboard navigation.
- **FR-015**: All user-facing text MUST be in Chinese (Simplified), sourced from a centralized locale/constants module.
- **FR-016**: If a match is currently in progress (live status), the landing page MUST display a "Live" status badge with pulsing indicator on that match card, linking to the match detail page. The landing page MUST NOT perform real-time score polling or WebSocket connections for live updates.
- **FR-017**: The landing page MUST use Incremental Static Regeneration (ISR) with a short revalidation interval (~60 seconds) so match data stays near-fresh while the page is served statically for optimal performance.
- **FR-018**: The landing page sections MUST appear in this order from top to bottom: (1) Sticky Navigation Bar, (2) Hero Section, (3) Upcoming Matches, (4) Recent Results, (5) Team Introduction, (6) Footer.
- **FR-019**: The landing page MUST be developed against local mock/seed data (JSON fixtures) that define the match and team data shape. EdgeOne KV integration is a separate concern to be swapped in later without changing the UI components.

### Key Entities

- **Match**: Represents a football match with attributes including date/time, opponent team name, venue, score (if completed), and status (upcoming, live, completed, cancelled). Match cards always display both team names with Pengyang ("鹏飏") listed first. On the landing page, live matches display a "Live" status badge that links to the match detail page; real-time score updates are not shown on the landing page itself.
- **Team Profile**: The Pengyang Football team's identity — name, tagline, description, and associated photos.
- **Navigation Item**: A link entry used in both the top navigation bar and footer, with a label and destination path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The landing page loads with a Largest Contentful Paint (LCP) of ≤ 2.5 seconds on a simulated 4G connection.
- **SC-002**: The landing page achieves a Cumulative Layout Shift (CLS) of ≤ 0.1 across all viewport sizes.
- **SC-003**: A first-time visitor can identify the team name, find the next upcoming match, and navigate to the full schedule within 30 seconds.
- **SC-004**: All text and interactive elements meet WCAG 2.1 Level AA contrast requirements (4.5:1 minimum).
- **SC-005**: The landing page renders a complete, usable layout on viewports from 320px to 1440px without horizontal scrolling or overlapping content.
- **SC-006**: 100% of interactive elements (buttons, links, cards) have touch targets of at least 44px on mobile.
- **SC-007**: The page is server-rendered — core content (hero, navigation, team introduction, footer) is visible in the initial HTML without requiring JavaScript execution.

## Assumptions

- The landing page is a public page and does not require authentication.
- Match data (upcoming and completed) will be available via an internal data source (EdgeOne KV or equivalent) — the landing page consumes this data but does not manage it. Data is fetched at build/revalidation time via ISR (~60-second revalidation), not on every request.
- For initial development and testing, the landing page will be built against local mock/seed data (JSON fixtures). EdgeOne KV integration will be introduced as a separate task, swapping the data source without changing UI components.
- Hero photography and team photos are pre-uploaded and available via Tencent Cloud COS or a similar asset storage system. A fallback is provided when photos are absent.
- The team tagline defaults to "友谊第一，比赛第二" unless a custom tagline is configured.
- The landing page is the root route (`/`) of the application.
- The navigation structure includes at minimum: 赛程 (Schedule), 球队介绍 (Team), 相册 (Gallery). Additional links may be added later.
- Video embeds are not part of the landing page scope — they belong on individual match detail pages.
- Admin-only features (e.g., "赛事管理" button) are not visible on the landing page for unauthenticated visitors.
- Match cards link to `/matches/[id]` but the match detail page is out of scope for this feature. A placeholder page displaying "Coming soon" will be used until the match detail feature is built.

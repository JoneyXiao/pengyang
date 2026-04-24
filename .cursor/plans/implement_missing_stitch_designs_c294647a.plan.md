---
name: Implement Missing Stitch Designs
overview: "Implement the three major design gaps between the Stitch outputs and the current frontend: (1) landing page asymmetric bento highlights section, (2) team introduction structured sections around the editable content, and (3) match management admin bento dashboard restyle."
todos:
  - id: landing-bento
    content: Rewrite landing page highlights section as asymmetric bento grid (primary card, secondary card, orange accent card, quote card)
    status: completed
  - id: team-hero
    content: Add full-height hero to team page with gradient overlay and display-hero text
    status: completed
  - id: team-philosophy
    content: Add full-bleed philosophy band section (black bg, 'ASPIRE & ACHIEVE', 3 value columns)
    status: completed
  - id: team-trophy
    content: Add trophy cabinet section (4-col grid with trophy items and 'VIEW FULL RECORDS' CTA)
    status: completed
  - id: admin-header
    content: Restyle match management header with Jost display type and QUICK ACTION button
    status: completed
  - id: admin-form
    content: Restyle ADD NEW MATCH form as bordered bento card with Swoosh Bold styling
    status: completed
  - id: admin-score
    content: Create LIVE SCORE widget with large display numbers and +/- controls
    status: completed
  - id: admin-media
    content: Restyle media section with dashed dropzone and preview grid
    status: completed
  - id: admin-list
    content: Restyle match list cards with Swoosh Bold typography and better layout
    status: completed
  - id: type-check
    content: Run tsc + vite build + biome check to verify no regressions
    status: completed
isProject: false
---

# Implement Missing Stitch Designs

## Gap Analysis

The [previous redesign chat](b65c1392-33c9-47a0-95f6-cfed0ec33ee2) implemented most of the Stitch public page designs (Navbar, Footer, Hero, CountdownTimer, Roster, MatchCard, etc.). Three significant gaps remain:

### Gap 1: Landing Page "赛场高光" Section

The Stitch design (`.stitch/landing_page/landing_page/screen.png`) shows an **asymmetric bento grid** with featured stories, an orange promo card, and a coach interview quote. The current implementation at [frontend/src/routes/_public/index.tsx](frontend/src/routes/_public/index.tsx) just renders a plain 3-column grid of `MatchCard` components.

**Stitch design elements missing:**
- Large featured match story (spans 2 rows, with image gradient overlay + "高光时刻" tag)
- Small image card with date + article title
- Orange promo card (soccer icon, "青训营招新开启", CTA link)
- Coach interview quote card with chip label

### Gap 2: Team Introduction Page

The Stitch design (`.stitch/landing_page/team_introduction/screen.png`) shows 4 rich structured sections. The current [frontend/src/routes/_public/team.tsx](frontend/src/routes/_public/team.tsx) only has a black header banner + renders admin-editable rich text.

**Stitch design sections not implemented:**
1. **Full-height hero** (~716px) with background image/gradient and "BLOOD, SWEAT & GLORY." display-hero text
2. **"LEGACY BUILT ON TURF" history bento** -- 3-col grid with image blocks + text milestones
3. **Full-bleed philosophy band** -- Black section, "ASPIRE & ACHIEVE" heading, 3 value columns
4. **TROPHY CABINET** -- 4-column grid of trophy items + "VIEW FULL RECORDS" CTA

**Approach (hybrid):** Keep the admin-editable rich text content area, but wrap it with the structured hero, philosophy band, and trophy cabinet. The editable content lives between the hero and philosophy sections.

### Gap 3: Match Management Admin Dashboard

The Stitch design (`.stitch/match_management/screen.png`) shows a bento dashboard layout. The current [frontend/src/routes/_layout/match-management.tsx](frontend/src/routes/_layout/match-management.tsx) is a 593-line file with functional CRUD using basic form/list patterns.

**Stitch design elements not implemented:**
- "MATCH MANAGEMENT / DASHBOARD" header with Jost display type + "QUICK ACTION" button
- Bento 3-column grid layout:
  - **"ADD NEW MATCH"** card (border-2, datetime + opponent + location + tactical notes textarea + full-width "PUBLISH MATCH" pill)
  - **"LIVE SCORE"** card (pulsing LIVE badge, large score display with +/- buttons, "FINALIZE RESULT" pill)
  - **"MEDIA UPLOAD"** full-width card (dashed dropzone, preview grid with image/video thumbnails, delete overlays)

**Approach:** Restyle the existing match-management.tsx to use the bento dashboard layout while preserving all existing business logic (CRUD mutations, status toggling, media upload, match updates). The existing sidebar layout (`_layout.tsx` with `AppSidebar`) stays -- we only restyle the page content inside it.

---

## Implementation Details

### 1. Landing Page Bento Highlights

**File:** [frontend/src/routes/_public/index.tsx](frontend/src/routes/_public/index.tsx)

Replace the current "赛场高光" section (lines ~108-140) with an asymmetric bento grid. Since the API returns `recent_matches` (not articles/stories), we adapt the bento layout to work with match data:

- **Primary card** (spans 2 rows): First recent match rendered large with gradient overlay, "高光时刻" tag, and match title
- **Secondary card** (top-right): Second recent match, smaller format with date and teams
- **Accent card** (orange): Static or configurable promo card for "青训营" or similar team announcements
- **Quote card** (bottom-right): Third recent match or a static coach quote section
- Fall back to current 3-col grid if fewer than 2 matches exist

### 2. Team Introduction Structured Sections

**File:** [frontend/src/routes/_public/team.tsx](frontend/src/routes/_public/team.tsx)

Restructure the page layout to wrap the admin-editable content with Stitch-designed sections:

```
1. Full-height hero (gradient overlay, "BLOOD, SWEAT & GLORY." display text)
2. Admin-editable rich text content (existing, moved between hero and philosophy)
3. Full-bleed philosophy band (black bg, "ASPIRE & ACHIEVE", 3 value columns)
4. Trophy cabinet (4-col grid with placeholder trophies, "VIEW FULL RECORDS")
5. Footer
```

The structured sections use hardcoded content matching the Stitch design since this represents the team's brand identity. The editable section in the middle allows admins to update team descriptions.

### 3. Match Management Admin Bento Dashboard

**File:** [frontend/src/routes/_layout/match-management.tsx](frontend/src/routes/_layout/match-management.tsx)

Restyle from flat list to bento dashboard. The page structure becomes:

```
Header: "MATCH MANAGEMENT / DASHBOARD" + "QUICK ACTION" pill button
Bento grid (xl:grid-cols-3):
  - [xl:col-span-2] ADD NEW MATCH form card (border-2 border-black)
  - [xl:col-span-1] LIVE SCORE widget (with +/- buttons for active match)
  - [xl:col-span-3] MEDIA UPLOAD card (dropzone + preview grid)
Below bento: Match list (existing list view, restyled with Swoosh Bold tokens)
```

Key changes:
- Form inputs get `focus:border-[#111111]` focus states and label-caps styling
- Score widget uses large Jost display numbers with +/- controls
- Media section adds a dashed dropzone visual (CSS-only, reuses existing `<input type="file">`)
- Match list cards refined with Swoosh Bold typography and status badges
- All existing mutations/queries preserved as-is

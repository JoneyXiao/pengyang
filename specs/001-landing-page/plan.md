# Implementation Plan: Landing Page

**Branch**: `001-landing-page` | **Date**: 2026-04-19 | **Spec**: [specs/001-landing-page/spec.md](spec.md)
**Input**: Feature specification from `specs/001-landing-page/spec.md`

## Summary

Build the public landing page for the Pengyang Football (鹏飏足球) primary school team website. The page is the root route (`/`) and serves as the first impression for parents, students, coaches, and administrators. It comprises a hero section with action photography, upcoming-match cards, recent-result cards with monospace scores, a team introduction with photos, sticky responsive navigation, and a dark footer. Built as a Next.js App Router page using ISR (60s revalidation), Server Components by default, shadcn/ui primitives, and mock seed data for initial development. Fully responsive from 320px to 1440px+, mobile-first.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js LTS  
**Primary Dependencies**: Next.js (App Router), React, shadcn/ui, Tailwind CSS, Noto Sans SC (Google Fonts)  
**Storage**: Local JSON fixtures (mock data) for initial development; EdgeOne KV integration deferred  
**Testing**: Vitest + React Testing Library for unit/component tests  
**Target Platform**: Web — EdgeOne Pages deployment (Edge Runtime)  
**Project Type**: Web application (Next.js App Router — single deployment unit)  
**Performance Goals**: LCP ≤ 2.5s on 4G, CLS ≤ 0.1, JS bundle < 150 KB gzipped per route  
**Constraints**: No dark mode on public pages, WCAG 2.1 AA, Chinese (Simplified) primary language, all text from centralized locale module  
**Scale/Scope**: Single landing page with 6 sections, ~10 components, mock data layer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Gate | Status |
|---|-----------|------|--------|
| I | Code Quality | TypeScript strict, function components, App Router conventions, kebab-case files, PascalCase exports | ✅ PASS — plan uses TS strict, Server Components default, App Router file conventions |
| I | Code Quality | No `any` types, no `eslint-disable` without justification | ✅ PASS — no exceptions anticipated |
| II | Testing | Unit tests for data transforms, component tests for interactive UI | ✅ PASS — mock-first approach enables reliable tests with no external deps |
| II | Testing | Tests co-located or in `__tests__/`, no network dependencies | ✅ PASS — JSON fixtures, no EdgeOne KV needed for tests |
| III | UX Consistency | shadcn/ui primitives, Tailwind theme tokens, no hard-coded colors | ✅ PASS — DESIGN.md tokens mapped to Tailwind CSS variables |
| III | UX Consistency | Responsive 320–1440px, WCAG AA, semantic HTML landmarks | ✅ PASS — spec requires mobile-first responsive, focus indicators, landmarks |
| III | UX Consistency | Chinese text from centralized locale module | ✅ PASS — FR-015 mandates centralized locale/constants |
| IV | Performance | LCP ≤ 2.5s, CLS ≤ 0.1, JS < 150KB gzip, Next.js `<Image>` | ✅ PASS — ISR + Server Components minimize client JS, `<Image>` for all photos |
| IV | Performance | ISR/static for homepage | ✅ PASS — FR-017 mandates ISR with 60s revalidation |
| IV | Performance | Third-party scripts lazy-loaded | ✅ PASS — no third-party scripts on landing page (no video embeds in scope) |

**Gate result**: ALL PASS — no violations, no Complexity Tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx               # Root layout: fonts, metadata, nav, footer
│   ├── page.tsx                 # Landing page (Server Component, ISR)
│   ├── loading.tsx              # Loading skeleton
│   └── globals.css              # Tailwind + CSS custom properties
├── components/
│   ├── layout/
│   │   ├── site-header.tsx      # Sticky nav bar + mobile hamburger
│   │   ├── site-footer.tsx      # Dark footer
│   │   └── mobile-nav-sheet.tsx # Slide-in mobile nav (Client Component)
│   ├── landing/
│   │   ├── hero-section.tsx     # Hero image + overlay text + CTA
│   │   ├── matches-section.tsx  # Upcoming matches section
│   │   ├── results-section.tsx  # Recent results section
│   │   ├── team-intro-section.tsx # Team introduction section
│   │   └── empty-state.tsx      # Reusable empty-state message
│   └── ui/
│       ├── match-card.tsx       # Match card (upcoming + result variants)
│       ├── status-badge.tsx     # Live/Upcoming/Completed/Cancelled badge
│       └── (shadcn/ui)          # shadcn/ui primitives (button, sheet, etc.)
├── lib/
│   ├── data/
│   │   ├── matches.ts           # Data-fetching functions (reads fixtures or KV)
│   │   └── team.ts              # Team profile data-fetching
│   ├── types/
│   │   └── index.ts             # Match, TeamProfile, NavItem types
│   └── constants/
│       └── locale.ts            # All Chinese UI text strings
├── data/
│   └── fixtures/
│       ├── matches.json         # Mock match data
│       └── team.json            # Mock team profile data
└── __tests__/
    ├── components/
    │   ├── match-card.test.tsx
    │   ├── status-badge.test.tsx
    │   ├── hero-section.test.tsx
    │   └── site-header.test.tsx
    └── lib/
        └── matches.test.ts
```

**Structure Decision**: Next.js App Router single-project layout. All source under `src/` with the App Router `app/` directory for routes/layouts. Components split into `layout/` (structural), `landing/` (page-specific sections), and `ui/` (reusable primitives including shadcn/ui). Data layer in `lib/data/` with a swappable interface (JSON fixtures now, EdgeOne KV later). Tests in `__tests__/` mirroring source structure.

## Complexity Tracking

> No violations — table not needed.

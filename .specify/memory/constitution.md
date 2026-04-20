<!--
  Sync Impact Report
  ===================
  Version change: N/A → 1.0.0 (initial adoption)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (4 principles: Code Quality, Testing Standards,
      User Experience Consistency, Performance Requirements)
    - Technology Stack & Constraints
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no update needed
      (Constitution Check is dynamically resolved at plan time)
    - .specify/templates/spec-template.md ✅ no update needed
      (generic template, compatible with new principles)
    - .specify/templates/tasks-template.md ✅ no update needed
      (generic template, compatible with new principles)
  Follow-up TODOs: None
-->

# Pengyang(鹏飏) Football (深圳市龙华区观湖实验学校) Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST be written in TypeScript with strict mode enabled
(`"strict": true` in `tsconfig.json`). No use of `any` type except
at third-party integration boundaries where types are unavailable.

- Every React component MUST be a function component using hooks.
- Components MUST follow the Next.js App Router file conventions
  (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Server Components MUST be the default; Client Components
  (`"use client"`) are permitted only when browser APIs, event
  handlers, or stateful hooks are required.
- All API routes MUST validate input at the boundary using a schema
  validation library (e.g., Zod). Raw user input MUST NOT propagate
  beyond the handler entry point.
- No `eslint-disable` or `@ts-ignore` without an inline comment
  explaining why and a linked issue for resolution.
- File and folder naming MUST use kebab-case. Component exports MUST
  use PascalCase. Utility functions MUST use camelCase.

**Rationale**: Strict typing and consistent conventions prevent
runtime errors, reduce onboarding friction, and keep the codebase
navigable as the project grows.

### II. Testing Standards

Every feature MUST include tests that cover the critical user path.
Tests MUST be runnable in CI without external service dependencies.

- Unit tests MUST cover all utility functions, data transformations,
  and business logic (e.g., match scheduling validation, score
  formatting).
- Integration tests MUST cover API route handlers end-to-end using
  mocked storage backends (EdgeOne KV, Tencent Cloud COS).
- Component tests MUST verify that interactive UI elements (forms,
  modals, navigation) render correctly and respond to user events.
- Tests MUST NOT depend on network access, real databases, or
  third-party APIs. All external dependencies MUST be mocked or
  stubbed.
- Test files MUST be co-located with the source they test using the
  `*.test.ts` / `*.test.tsx` naming convention, or placed under a
  top-level `__tests__/` directory mirroring the source structure.

**Rationale**: Reliable, fast tests enable confident deployments and
catch regressions early — critical for a site that surfaces live
match data to parents and the public.

### III. User Experience Consistency

The UI MUST present a cohesive, accessible experience across all
pages and device sizes. Design decisions MUST be systematic, not
ad hoc.

- All UI components MUST be built with or composed from shadcn/ui
  primitives. Custom components MUST follow the same API patterns
  (props, variants, slots) as shadcn/ui.
- Color, typography, spacing, and radius tokens MUST be defined in
  the Tailwind/CSS theme config and referenced via utility classes.
  Hard-coded color values in component files are prohibited.
- Every page MUST be responsive from 320 px to 1440 px viewport
  width. Mobile layout MUST be the baseline; desktop layout is the
  progressive enhancement.
- Interactive elements MUST meet WCAG 2.1 Level AA: minimum 4.5:1
  contrast ratio for text, visible focus indicators, and semantic
  HTML landmarks (`<nav>`, `<main>`, `<header>`, `<footer>`).
- All user-facing text MUST support Chinese (Simplified) as the
  primary language. UI labels MUST NOT be hard-coded in component
  files; they MUST be extracted to a centralized locale/constants
  module to enable future i18n.
- Media embeds (Tencent Video, Bilibili) MUST use responsive
  aspect-ratio containers and MUST include meaningful `title`
  attributes for accessibility.

**Rationale**: The audience — students, parents, rival teams, and
the general public — spans a wide range of devices and abilities.
Consistency builds trust; accessibility is a legal and ethical
baseline.

### IV. Performance Requirements

Pages MUST load fast on commodity mobile networks. Performance
budgets are enforced, not aspirational.

- Largest Contentful Paint (LCP) MUST be ≤ 2.5 s on a simulated
  4G connection for all public-facing pages.
- Cumulative Layout Shift (CLS) MUST be ≤ 0.1 for every page.
- Total JavaScript bundle shipped to the client for any single
  route MUST NOT exceed 150 KB gzipped (excluding polyfills).
- Images MUST use Next.js `<Image>` component with automatic
  format negotiation (WebP/AVIF) and responsive `sizes` attribute.
  No raw `<img>` tags in production code.
- Match photo uploads MUST be optimized server-side (resized,
  compressed) before storage in Tencent Cloud COS. Original files
  MAY be retained separately.
- Static and infrequently changing pages (homepage, team intro,
  coach/player profiles) MUST leverage ISR or static generation.
  Dynamic data (live match updates) MUST use client-side fetching
  with appropriate cache headers via EdgeOne KV.
- Third-party scripts (analytics, video embeds) MUST be loaded
  with `next/script` strategy `lazyOnload` or `afterInteractive`
  to avoid blocking first paint.

**Rationale**: The primary audience accesses the site from mobile
phones — often on school or public Wi-Fi. Fast load times directly
affect engagement and the ability to follow live match updates.

## Technology Stack & Constraints

- **Framework**: Next.js (App Router) — serves frontend, admin
  backend, and API routes in a single deployment unit.
- **UI Library**: shadcn/ui + Tailwind CSS for all components.
- **Authentication**: NextAuth.js for admin login. Public pages
  MUST NOT require authentication.
- **Storage**: EdgeOne KV for structured data (matches, team info,
  real-time updates). Tencent Cloud COS for binary assets (photos,
  uploaded media).
- **Video**: Embedded players from Tencent Video or Bilibili. No
  self-hosted video streaming.
- **Deployment**: EdgeOne Pages. All builds MUST pass linting,
  type-checking, and tests before deployment.
- **Node.js Runtime**: MUST target the Edge Runtime where possible
  for API routes. Node.js runtime is permitted only when Edge
  Runtime APIs are insufficient (e.g., sharp for image processing).
- **Dependencies**: New runtime dependencies MUST be justified in
  the PR description. Prefer platform APIs and built-in Next.js
  features over third-party packages.

## Development Workflow & Quality Gates

- Every change MUST pass the following CI gates before merge:
  1. `tsc --noEmit` — zero type errors.
  2. `eslint` — zero errors (warnings are permitted but tracked).
  3. `test` — all tests pass.
  4. `build` — production build succeeds without warnings.
- Feature branches MUST follow the naming convention
  `###-feature-name` (numeric prefix + kebab-case descriptor).
- Commits MUST use Conventional Commits format
  (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- Admin-facing features MUST be tested with at least one
  authenticated and one unauthenticated scenario to verify access
  control.
- Media upload flows MUST be tested with file-size and file-type
  boundary checks (e.g., oversized image, unsupported format).

## Governance

This constitution is the authoritative source of project standards.
All code reviews and implementation decisions MUST reference these
principles when resolving disputes.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and migration plan for affected
  code. Principle removals or redefinitions require MAJOR version
  increment.
- **Versioning**: MAJOR.MINOR.PATCH — MAJOR for breaking governance
  changes, MINOR for new principles or material expansions, PATCH
  for clarifications and typo fixes.
- **Compliance Review**: At the start of each new feature
  specification (`/speckit.plan`), the Constitution Check section
  MUST be filled with gates derived from these principles. Violations
  MUST be explicitly justified in the Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-04-19 | **Last Amended**: 2026-04-19

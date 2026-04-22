<!--
  Sync Impact Report

  - Version change: 1.0.0 -> 2.0.0
  - Modified principles:
    - I. Code Quality -> I. Security & Secrets (new)
    - II. Testing Standards -> split into V. Testing & Quality Gates
    - III. User Experience Consistency -> III. Design System Compliance
      (rewritten for Swoosh Bold design system)
    - IV. Performance Requirements -> X. Performance Requirements (revised)
  - Added sections:
    - II. API-First Contracts (OpenAPI) & Generated Client
    - III. Database Change Discipline (SQLModel + Alembic)
    - IV. Frontend-Backend Integration Discipline
    - VI. Tooling & Quality Discipline
    - VII. Reproducible Environments (Docker Compose)
    - VIII. Spec-Driven Development (SpecKit Articles)
    - IX. Tooling: Use Available MCP Servers
    - X. Operability & Developer Experience
    - XI. Design System Compliance (Swoosh Bold)
    - XII. Performance Requirements
  - Removed sections:
    - Technology Constraints (merged into Project Constraints & Stack)
    - Development Workflow (rewritten as Development Workflow & Change
      Management)
  - Templates requiring updates:
    - ✅ reviewed: .specify/templates/plan-template.md (dynamic gates)
    - ✅ reviewed: .specify/templates/spec-template.md (generic)
    - ✅ reviewed: .specify/templates/tasks-template.md (generic)
    - ✅ reviewed: .specify/templates/checklist-template.md (generic)
  - Follow-up TODOs: none
-->

# Pengyang Football (鹏飏足球) Constitution

## Core Principles

### I. Security & Secrets (Non-Negotiable)

- MUST never commit secrets (tokens, passwords, private keys) to the repo.
  Use environment variables and documented secret management for deployment.
- MUST treat auth, password recovery, and token flows as security-critical:
  validate inputs, handle errors safely, and apply least-privilege access
  controls.
- MUST avoid logging sensitive data (credentials, tokens, PII). When in
  doubt, redact.
- SHOULD add tests for security-sensitive changes (auth, permissions, token
  handling, password reset, email flows).

Rationale: This project handles student/parent data and admin credentials;
unsafe defaults propagate to production.

### II. API-First Contracts (OpenAPI) & Generated Client

- MUST keep the backend OpenAPI schema accurate whenever API behavior
  changes.
- MUST regenerate and commit the frontend client when the OpenAPI schema
  changes (preferred: `./scripts/generate-client.sh`; alternative:
  `npm run generate-client` from `frontend/`).
- MUST minimize breaking API changes. If breaking changes are unavoidable,
  document migration impact in the feature spec/plan and provide
  backwards-compatible paths when feasible.

Rationale: A typed generated client prevents drift and reduces runtime
errors across match management, media upload, and live-update endpoints.

### III. Database Change Discipline (SQLModel + Alembic)

- MUST implement schema changes via SQLModel models and Alembic migrations.
- MUST create an Alembic revision and apply it for any model/table change;
  commit generated migration files.
- MUST keep migrations incremental and reviewable (clear message; no manual
  DB drift).

Rationale: Match data, player profiles, and media records require clean
upgrade paths.

### IV. Frontend-Backend Integration Discipline

- MUST implement frontend-to-backend communication using the generated
  client (`frontend/src/client/`).
- MUST NOT introduce ad-hoc direct calls to backend endpoints (e.g., raw
  `fetch` or `axios`) that bypass generated types, auth, or error-handling
  conventions. Exceptions require explicit documentation in the feature plan
  (what/why) and must keep auth/error handling consistent.

Rationale: Consistent integration reduces bugs and keeps contracts
enforceable across match, player, and media features.

### V. Testing & Quality Gates

- MUST keep changes independently testable. Feature specs MUST include
  acceptance scenarios.
- SHOULD add/adjust backend tests (Pytest) for changed business logic and
  API endpoints. New endpoints MUST include at least one happy-path and one
  error-path test.
- SHOULD add/adjust frontend tests for user-facing flows; use Playwright
  for end-to-end flows (login, match viewing, photo upload, live updates).
- If tests are intentionally omitted, the plan MUST include a written
  justification and a concrete follow-up (issue/ticket, timeframe, or
  explicit risk acceptance).
- SHOULD ensure GitHub Actions checks pass before merging; failing CI
  blocks merge.
- When a bug is fixed, a test MUST be added that reproduces the bug before
  the fix is applied.
- Tests MUST NOT depend on execution order or shared mutable state.

Rationale: Regressions in match schedules, live updates, or media uploads
directly affect parents and coaches relying on the site.

### VI. Tooling & Quality Discipline

- MUST keep the established tooling discipline:
  - Backend quality gates: `ruff` linting with zero warnings + type hints
    on all modules.
  - Frontend quality gates: `biome` + TypeScript `strict` mode. No `any`
    types except in auto-generated client code.
- MUST pass repo lint/format/typecheck tasks used by CI.
- MUST keep generated artifacts generated (e.g., OpenAPI client). Do not
  leave the repo in a half-generated state.

Rationale: Predictable CI and low contributor overhead.

### VII. Reproducible Environments (Docker Compose)

- MUST keep local and production-like environments reproducible and
  documented.
- Changes that affect runtime behavior MUST work in Docker Compose.
- `compose.yml`, `compose.override.yml`, and `compose.traefik.yml` MUST
  stay in sync with code and docs.

Rationale: Reproducibility ensures any contributor can run the full stack
locally.

### VIII. Spec-Driven Development (SpecKit Articles)

When using SpecKit workflows, work MUST be scoped under `specs/<feature>/`
and plans MUST include a "Constitution Check" gate.

These articles guide spec-driven feature work. If they conflict with project
reality, document the exception in the feature plan's "Complexity Tracking"
table.

- Article I — Library-First Principle: New reusable capabilities MUST have
  a clear boundary and be independently testable.
- Article II — Test-First Imperative: For contract/security-critical work,
  tests MUST be added/updated before or alongside implementation.
- Article III — Integration Testing: End-to-end flows SHOULD be covered
  with integration tests (Pytest) and/or Playwright where applicable.
- Article IV — Observability: Changes MUST be operable: actionable errors,
  clear failure modes, and logs that help debugging without leaking
  secrets/PII.
- Article V — Versioning & Breaking Changes: Breaking API/contract changes
  MUST be avoided when feasible; if unavoidable, document migration impact.
- Article VI — Simplicity Gate: Start simple (YAGNI). Any added complexity
  MUST be justified in the feature plan.
- Article VII — Anti-Abstraction Gate: Prefer using frameworks directly
  (FastAPI, SQLModel, TanStack) instead of wrapper layers unless needed.
- Article VIII — Integration-First Testing: Prefer realistic tests over
  heavy mocking when feasible.

### IX. Tooling: Use Available MCP Servers

- When using agent tooling, MUST use available installed MCP servers where
  applicable (e.g., for up-to-date library docs or project-specific
  tooling).
- MUST prefer MCP-provided documentation and APIs over assumptions from
  model memory when an MCP server exists for that library/framework.
- If an MCP server exists but is not used, MUST document why (insufficient
  coverage, access limitations, or not relevant to the task).

### X. Operability & Developer Experience

- MUST provide actionable error messages and handle failures explicitly
  (avoid silent failures).
- SHOULD log important events for debugging/operations without leaking
  sensitive data.
- SHOULD keep changes small, reviewable, and aligned with existing project
  structure.

Rationale: Operability and developer ergonomics reduce onboarding friction
for contributors.

### XI. Design System Compliance (Swoosh Bold)

The public site MUST follow the design system defined in `DESIGN.md`.

- **Design system adherence**: All components MUST use the color tokens,
  typography scale, spacing scale, border-radius values, and elevation
  levels defined in `DESIGN.md`. No ad-hoc colors, font sizes, or shadow
  values.
- **Typography**: Display headlines MUST use Jost at 700–900 weight. Body
  text MUST use Inter at 400–500 weight. System mono MUST be reserved for
  code/data only. No font below 12px.
- **Color discipline**: `#111111` (Nike Black) is the primary. `#FA5400`
  (Blaze Orange) is reserved exclusively for sale/urgency moments.
  `#FFFFFF` is the canvas. No decorative colors outside the defined
  palette.
- **Responsive behavior**: Every page MUST function at mobile, tablet, and
  desktop breakpoints. Touch targets MUST be ≥ 44px on mobile.
- **Accessibility**: All interactive elements MUST have visible focus
  indicators. All images MUST have `alt` text. Form inputs MUST have
  associated `<label>` elements. Color contrast MUST meet WCAG 2.1 AA
  (4.5:1 for text).
- **Language**: All user-facing text MUST be in Simplified Chinese. Admin
  UI MUST share the same visual language as the public site.

Rationale: `DESIGN.md` is the authoritative design specification and is
considered an extension of this principle.

### XII. Performance Requirements

Pages MUST load fast on school and mobile networks.

- **Initial load**: Largest Contentful Paint (LCP) MUST be under 2.5s on
  a 4G connection. Total JavaScript bundle for initial route MUST be under
  200 KB gzipped.
- **Image optimization**: All images MUST use modern formats (WebP/AVIF)
  with responsive `sizes` attributes. Hero images MUST use eager loading.
  Below-fold images MUST use `loading="lazy"`.
- **API response time**: Backend endpoints MUST respond within 200ms at
  p95 under normal load. Database queries MUST use appropriate indexes;
  N+1 queries are not permitted.
- **Font loading**: Jost and Inter MUST load via Google Fonts with
  `display=swap`. Preload 700/900 weights for Jost and 400/500 for Inter.
  Total initial font payload MUST be under 200 KB.
- **Media uploads**: Photo and video upload endpoints MUST validate file
  type and size server-side. Maximum upload size MUST be enforced (10 MB
  for photos, 100 MB for videos). Upload progress MUST be shown to the
  user.

## Project Constraints & Stack

- Backend: FastAPI + SQLModel + Alembic + PostgreSQL; tests with Pytest
  (`backend/`).
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui +
  TanStack Router/Query; end-to-end tests with Playwright (`frontend/`).
- Runtime/Dev: Docker Compose is the default stack runner (local and
  production-like).
- Infrastructure: Traefik reverse proxy handles routing; production/staging
  TLS termination is configured via `compose.traefik.yml`.
- CI/CD: GitHub Actions provides automated testing, linting, and related
  checks.
- Authentication: JWT-based with secure password hashing.
- No new frameworks: Adding a new major dependency requires explicit
  justification and approval.
- Docs to consult before changing behavior: `development.md`,
  `deployment.md`, `backend/README.md`, `frontend/README.md`.

## Development Workflow & Change Management

All feature work follows this sequence (when applicable):

1. Design data model
2. Create/update migrations (Alembic) and verify upgrade path
3. Implement backend logic and keep OpenAPI accurate
4. Test backend changes
5. Regenerate frontend client when contracts change and commit artifacts
6. Implement frontend changes using the generated client
7. Validate end-to-end behavior and fix regressions
8. Ensure CI passes (tests, linting, typechecks) before requesting review

Review expectations:

- PRs MUST state whether they change OpenAPI and whether client
  regeneration is included.
- PRs MUST state whether they include tests; if not, include explicit
  justification.
- UI changes MUST be reviewed against `DESIGN.md`. Deviations require
  explicit justification in the PR description.
- PRs SHOULD pass CI checks before merge approval.

## Governance

- Authority: This constitution supersedes local conventions, templates, and
  generated plans.
- Amendments: Changes MUST be made explicitly via PR that includes
  rationale, migration impact (if any), and a version bump.
- Versioning: Semantic versioning applies.
  - MAJOR: backward-incompatible governance/principle redefinition or
    removals.
  - MINOR: new principle/section added or materially expanded guidance.
  - PATCH: wording/clarifications that do not change meaning.
- Compliance review: Specs/plans/tasks MUST be reviewed for constitution
  alignment before implementation begins.

**Version**: 2.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22

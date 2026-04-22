# Implementation Plan: User Authentication & Role Management

**Branch**: `002-user-auth-management` | **Date**: 2026-04-22 | **Spec**: [specs/002-user-auth-management/spec.md](spec.md)
**Input**: Feature specification from `specs/002-user-auth-management/spec.md`

## Summary

Build the user authentication and role management system for the Pengyang Football website. The feature adds registration (email + username + password), login, session management, user profiles with default football avatars, a three-tier role system (regular/admin/super_admin), admin role request workflow, and role-based access control. Built on Supabase Auth for authentication and Supabase Postgres for profiles/roles, with defense-in-depth security via RLS policies and Next.js middleware. The super admin account is provisioned via an idempotent seed migration using environment variables.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js LTS  
**Primary Dependencies**: Next.js 16 (App Router), React 19, shadcn/ui, Tailwind CSS, `@supabase/supabase-js`, `@supabase/ssr`, Zod  
**Storage**: Supabase Database (PostgreSQL) for user profiles, roles, admin requests; Supabase Auth for authentication identity  
**Testing**: Vitest + React Testing Library for unit/component tests; mocked Supabase client for all tests  
**Target Platform**: Web — EdgeOne Pages deployment (Edge Runtime)  
**Project Type**: Web application (Next.js App Router — single deployment unit)  
**Performance Goals**: LCP ≤ 2.5s on 4G, CLS ≤ 0.1, JS bundle < 150 KB gzipped per route  
**Constraints**: WCAG 2.1 AA, Chinese (Simplified) primary language, all text from centralized locale module, 7-day session expiry, defense-in-depth (RLS + middleware)  
**Scale/Scope**: ~15 new components, 2 database tables, 4 RLS policies, 1 seed migration, 6 new routes, 1 middleware

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Gate | Status |
|---|-----------|------|--------|
| I | Code Quality | TypeScript strict, function components, App Router conventions, kebab-case files, PascalCase exports | ✅ PASS |
| I | Code Quality | No `any` types, no `eslint-disable` without justification | ✅ PASS |
| I | Code Quality | API routes validate input at boundary using Zod | ✅ PASS |
| II | Testing | Unit tests for data transforms, component tests for interactive UI | ✅ PASS |
| II | Testing | Tests co-located or in `__tests__/`, no network dependencies | ✅ PASS |
| II | Testing | Admin features tested with authenticated + unauthenticated scenarios | ✅ PASS |
| III | UX Consistency | shadcn/ui primitives, Tailwind theme tokens, no hard-coded colors | ✅ PASS |
| III | UX Consistency | Responsive 320–1440px, WCAG AA, semantic HTML landmarks | ✅ PASS |
| III | UX Consistency | Chinese text from centralized locale module | ✅ PASS |
| IV | Performance | LCP ≤ 2.5s, CLS ≤ 0.1, JS < 150KB gzip | ✅ PASS |
| IV | Performance | Third-party scripts lazy-loaded | ✅ PASS |
| Tech Stack | Supabase Auth with `@supabase/ssr`, HTTP-only cookies | ✅ PASS |
| Tech Stack | RLS enabled on all Supabase tables | ✅ PASS |
| Tech Stack | Edge Runtime where possible | ✅ PASS |
| Workflow | Conventional Commits, CI gates (tsc, eslint, test, build) | ✅ PASS |

**Gate result**: ALL PASS — no violations, no Complexity Tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-user-auth-management/
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
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page (Client Component — form)
│   │   └── register/
│   │       └── page.tsx           # Registration page (Client Component — form)
│   ├── (protected)/
│   │   ├── layout.tsx             # Protected layout — checks auth session
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard (role-aware)
│   │   ├── profile/
│   │   │   └── page.tsx           # Profile edit page
│   │   └── admin/
│   │       ├── requests/
│   │       │   └── page.tsx       # Super admin: manage admin requests
│   │       └── users/
│   │           └── page.tsx       # Super admin: user management
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase auth callback handler
│   └── layout.tsx                 # Root layout (existing — add auth provider)
├── middleware.ts                   # Route protection middleware
├── components/
│   ├── auth/
│   │   ├── login-form.tsx         # Login form (Client Component)
│   │   ├── register-form.tsx      # Registration form (Client Component)
│   │   └── auth-provider.tsx      # Auth context provider (Client Component)
│   ├── dashboard/
│   │   ├── role-badge.tsx         # User role display badge
│   │   ├── admin-request-card.tsx # Admin request status card
│   │   └── admin-request-list.tsx # Pending requests list (super admin)
│   ├── profile/
│   │   └── profile-form.tsx       # Profile edit form (Client Component)
│   └── layout/
│       └── user-nav.tsx           # Authenticated user nav dropdown
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client (cookies)
│   │   └── middleware.ts          # Middleware Supabase client
│   ├── constants/
│   │   └── locale.ts              # Extended with auth UI labels
│   ├── validations/
│   │   └── auth.ts                # Zod schemas (register, login, profile)
│   ├── data/
│   │   ├── profiles.ts            # Profile CRUD operations
│   │   └── admin-requests.ts      # Admin request CRUD operations
│   └── types/
│       └── index.ts               # Extended with auth types
└── supabase/
    ├── migrations/
    │   └── 001_create_profiles_and_requests.sql
    └── seed.sql
```

**Structure Decision**: Extends the existing `src/` structure with route groups `(auth)` for public auth pages and `(protected)` for authenticated pages. Supabase client utilities go in `src/lib/supabase/`. Database migrations live in `supabase/migrations/` following Supabase CLI conventions.

## Complexity Tracking

> No violations detected. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

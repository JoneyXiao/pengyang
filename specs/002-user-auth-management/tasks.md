# Tasks: User Authentication & Role Management

**Input**: Design documents from `specs/002-user-auth-management/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure environment, prepare project structure for auth feature

- [x] T001 Install `@supabase/supabase-js`, `@supabase/ssr`, and `zod` dependencies via `pnpm add @supabase/supabase-js @supabase/ssr zod`
- [x] T002 [P] Add default football avatar SVG to `public/images/default-avatar.svg`
- [x] T003 [P] Add Supabase environment variables to `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`), update `.env.example`, and configure Supabase Auth session lifetime to 7 days (FR-020) in Supabase dashboard or project config
- [x] T004 [P] Add auth-related TypeScript types (`UserRole`, `RequestStatus`, `Profile`, `AdminRequest`, `AdminRequestWithProfile`) to `src/lib/types/index.ts`
- [x] T005 [P] Add auth UI locale strings (login, register, dashboard, profile, admin labels in Chinese) to `src/lib/constants/locale.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase clients, database schema, RLS policies, middleware — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create browser Supabase client in `src/lib/supabase/client.ts` using `createBrowserClient` from `@supabase/ssr`
- [x] T007 [P] Create server Supabase client in `src/lib/supabase/server.ts` using `createServerClient` with `await cookies()`
- [x] T008 [P] Create middleware Supabase client in `src/lib/supabase/proxy.ts` using `createServerClient` with request/response cookie handlers
- [x] T009 Create database migration with enums (`user_role`, `request_status`), `profiles` table, `admin_requests` table, unique partial index, `get_user_role()` function, `handle_new_user()` trigger, and `updated_at` trigger in `supabase/migrations/001_create_profiles_and_requests.sql`
- [x] T010 Create RLS policies for `profiles` table (select own, select admin, update own excluding role, update admin, delete protect) in `supabase/migrations/001_create_profiles_and_requests.sql`
- [x] T011 Create RLS policies for `admin_requests` table (insert own, select own, select admin, update admin) in `supabase/migrations/001_create_profiles_and_requests.sql`
- [x] T012 Create idempotent super admin seed script reading `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from environment in `supabase/seed.sql`
- [x] T013 [P] Create Zod validation schemas (`registerSchema`, `loginSchema`, `profileSchema`) in `src/lib/validations/auth.ts`
- [x] T014 Create auth callback route handler that exchanges auth code for session in `src/app/auth/callback/route.ts`
- [x] T015 Create Next.js proxy for route protection (session refresh, public route allowlist, protected route redirect, admin role gating) in `src/proxy.ts`

**Checkpoint**: Foundation ready — Supabase clients configured, schema deployed, RLS active, middleware protecting routes

---

## Phase 3: User Story 1 — Register and Log In (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts and log in with email + username + password

**Independent Test**: Register a new account, log in, verify redirect to dashboard

### Implementation for User Story 1

- [x] T016 [P] [US1] Implement `registerUser` server action with Zod validation, `supabase.auth.signUp()`, and username metadata in `src/app/(auth)/register/actions.ts`
- [x] T017 [P] [US1] Implement `loginUser` server action with Zod validation, `supabase.auth.signInWithPassword()`, and generic error message in `src/app/(auth)/login/actions.ts`
- [x] T018 [US1] Implement `logoutUser` server action with `supabase.auth.signOut()` in `src/app/(auth)/logout/actions.ts`
- [x] T019 [US1] Create `<RegisterForm />` client component with email, username, password fields, inline validation errors, and submit to `registerUser` in `src/components/auth/register-form.tsx`
- [x] T020 [US1] Create `<LoginForm />` client component with email, password fields, inline error, and submit to `loginUser` in `src/components/auth/login-form.tsx`
- [x] T021 [P] [US1] Create registration page using `<RegisterForm />` with link to login and success toast on registration in `src/app/(auth)/register/page.tsx`
- [x] T022 [P] [US1] Create login page using `<LoginForm />` with link to register in `src/app/(auth)/login/page.tsx`
- [x] T023 [US1] Create `<AuthProvider />` client component providing `{ user, profile, isLoading }` context via Supabase auth state listener in `src/components/auth/auth-provider.tsx`
- [x] T024 [US1] Create basic dashboard page that shows user greeting and role in `src/app/(protected)/dashboard/page.tsx`
- [x] T025 [US1] Create protected layout that checks auth session via server client in `src/app/(protected)/layout.tsx`
- [x] T026 [US1] Integrate `<AuthProvider />` into root layout and add login/logout nav link to `<SiteHeader />` in `src/app/layout.tsx`

**Checkpoint**: Users can register, log in, see dashboard. Unauthenticated users redirected to login.

---

## Phase 4: User Story 2 — Super Admin Manages Admin Requests (Priority: P1)

**Goal**: Super admin can view, approve, and reject pending admin role requests

**Independent Test**: Log in as super admin, view admin requests page, approve/reject requests

### Implementation for User Story 2

- [x] T027 [P] [US2] Implement `getPendingRequests()` data function querying `admin_requests` with profile join in `src/lib/data/admin-requests.ts`
- [x] T028 [P] [US2] Implement `approveRequest()` and `rejectRequest()` data functions (update status, set resolved_at/resolved_by, update profile role on approve) in `src/lib/data/admin-requests.ts`
- [x] T029 [P] [US2] Implement `demoteUser()` data function (update profile role from admin to regular) in `src/lib/data/admin-requests.ts`
- [x] T030 [US2] Implement `resolveAdminRequest` server action with Zod validation (`request_id`, `action`) in `src/app/(protected)/admin/requests/actions.ts`
- [x] T031 [US2] Implement `demoteUser` server action with Zod validation (`user_id`) in `src/app/(protected)/admin/users/actions.ts`
- [x] T032 [US2] Create `<AdminRequestList />` client component with approve/reject buttons calling `resolveAdminRequest` in `src/components/dashboard/admin-request-list.tsx`
- [x] T033 [US2] Create admin requests management page using `<AdminRequestList />` with empty state in `src/app/(protected)/admin/requests/page.tsx`
- [x] T034 [P] [US2] Implement `getAllProfiles()` data function in `src/lib/data/profiles.ts`
- [x] T035 [US2] Create user management page with user list, role badges, and demote action in `src/app/(protected)/admin/users/page.tsx`

**Checkpoint**: Super admin can manage pending requests and user roles. Admin routes gated by middleware + RLS.

---

## Phase 5: User Story 3 — User Requests Admin Role (Priority: P2)

**Goal**: Regular users can request admin privileges and see request status

**Independent Test**: Log in as regular user, submit admin request, verify pending status displayed

### Implementation for User Story 3

- [x] T036 [P] [US3] Implement `getMyAdminRequest()` data function returning latest request for current user in `src/lib/data/admin-requests.ts`
- [x] T037 [P] [US3] Implement `submitAdminRequest()` data function inserting pending request in `src/lib/data/admin-requests.ts`
- [x] T038 [US3] Implement `submitAdminRequest` server action with duplicate-check logic in `src/app/(protected)/dashboard/actions.ts`
- [x] T039 [US3] Create `<AdminRequestCard />` component showing request status and dates in `src/components/dashboard/admin-request-card.tsx`
- [x] T040 [US3] Update dashboard page to show request admin button (regular users), request status card (pending/rejected with re-request ability), and hide button for admins in `src/app/(protected)/dashboard/page.tsx`

**Checkpoint**: Regular users can request admin role, see status. Super admin sees requests in Phase 4 page.

---

## Phase 6: User Story 4 — Edit User Profile (Priority: P2)

**Goal**: Users can view and edit their profile (username, display name) with default football avatar

**Independent Test**: Log in, navigate to profile, verify avatar, edit display name, confirm persistence

### Implementation for User Story 4

- [x] T041 [P] [US4] Implement `getCurrentProfile()` data function in `src/lib/data/profiles.ts`
- [x] T042 [P] [US4] Implement `updateProfile()` data function with username uniqueness check in `src/lib/data/profiles.ts`
- [x] T043 [US4] Implement `updateProfile` server action with Zod validation in `src/app/(protected)/profile/actions.ts`
- [x] T044 [US4] Create `<ProfileForm />` client component with username, display_name fields, avatar display, inline errors in `src/components/profile/profile-form.tsx`
- [x] T045 [US4] Create profile page loading current profile and rendering `<ProfileForm />` in `src/app/(protected)/profile/page.tsx`

**Checkpoint**: Users can view their profile with football avatar and update username/display name.

---

## Phase 7: User Story 5 — Role-Based Content Management Access (Priority: P3)

**Goal**: Navigation shows role-appropriate links; unauthorized access redirected

**Independent Test**: Log in as each role, verify correct nav links and access control

### Implementation for User Story 5

- [x] T046 [US5] Create `<UserNav />` client component with avatar, dropdown menu, role-specific links (content mgmt for admin+, user mgmt for super_admin), and logout in `src/components/layout/user-nav.tsx`
- [x] T047 [US5] Create `<RoleBadge />` component displaying role label in Chinese with appropriate styling in `src/components/dashboard/role-badge.tsx`
- [x] T048 [US5] Update `<SiteHeader />` to conditionally render `<UserNav />` for authenticated users or login link for guests in `src/components/layout/site-header.tsx`
- [x] T049 [US5] Add placeholder content management page (admin/super_admin only) in `src/app/(protected)/admin/content/page.tsx`

**Checkpoint**: Navigation adapts per role. Unauthorized route access redirected by middleware. RLS prevents data bypass.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements across all user stories

- [x] T050 [P] Verify all auth UI labels use locale constants from `src/lib/constants/locale.ts` — no hard-coded Chinese strings in components
- [x] T051 [P] Verify responsive layout (320px–1440px) on login, register, dashboard, profile, and admin pages
- [x] T052 [P] Verify WCAG AA compliance: focus indicators, contrast ratios, semantic landmarks on all auth pages
- [x] T053 [P] Run Lighthouse audit on auth pages — verify LCP ≤ 2.5s, CLS ≤ 0.1, JS < 150KB gzip per route
- [x] T054 Run quickstart.md validation end-to-end (register → login → dashboard → profile → admin request flow)

---

## Phase 9: Testing

**Purpose**: Unit, component, and integration tests per constitution §II Testing Standards

**⚠️ CRITICAL**: Constitution requires tests for every feature. Admin features MUST have authenticated + unauthenticated scenarios.

### Unit Tests

- [x] T055 [P] Write unit tests for Zod validation schemas (`registerSchema`, `loginSchema`, `profileSchema`) in `src/__tests__/lib/validations/auth.test.ts`
- [x] T056 [P] Write unit tests for `profiles.ts` data functions with mocked Supabase client in `src/__tests__/lib/data/profiles.test.ts`
- [x] T057 [P] Write unit tests for `admin-requests.ts` data functions with mocked Supabase client in `src/__tests__/lib/data/admin-requests.test.ts`

### Component Tests

- [x] T058 [P] Write component tests for `<LoginForm />` — renders fields, shows validation errors, calls server action in `src/__tests__/components/auth/login-form.test.tsx`
- [x] T059 [P] Write component tests for `<RegisterForm />` — renders fields, shows validation errors, calls server action in `src/__tests__/components/auth/register-form.test.tsx`
- [x] T060 [P] Write component tests for `<ProfileForm />` — renders current profile, inline errors, submit in `src/__tests__/components/profile/profile-form.test.tsx`
- [x] T061 [P] Write component tests for `<AdminRequestList />` — renders requests, approve/reject buttons in `src/__tests__/components/dashboard/admin-request-list.test.tsx`
- [x] T062 [P] Write component tests for `<AdminRequestCard />` — renders status, dates in `src/__tests__/components/dashboard/admin-request-card.test.tsx`
- [x] T063 [P] Write component tests for `<UserNav />` — role-specific links, logout button in `src/__tests__/components/layout/user-nav.test.tsx`

### Integration Tests (Server Actions + Middleware)

- [x] T064 [P] Write integration tests for `registerUser` and `loginUser` server actions with mocked Supabase in `src/__tests__/app/auth/actions.test.ts`
- [x] T065 [P] Write integration tests for `resolveAdminRequest` and `demoteUser` server actions with mocked Supabase in `src/__tests__/app/admin/actions.test.ts`

### Access Control Tests (Constitution §II — authenticated + unauthenticated scenarios)

- [x] T066 [P] Write access control tests: unauthenticated user redirected from `/dashboard`, `/profile`, `/admin/*` to `/login` in `src/__tests__/app/middleware.test.ts`
- [x] T067 [P] Write access control tests: regular user can access `/dashboard` and `/profile` but redirected from `/admin/*`; super_admin can access all routes in `src/__tests__/app/middleware.test.ts`

**Checkpoint**: All tests pass. Constitution §II Testing Standards fully satisfied.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001 for packages) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion; can run in parallel with US1 if needed, but US1 provides the login flow used for testing
- **User Story 3 (Phase 5)**: Depends on Phase 2; integrates with US2 (requests appear in admin page)
- **User Story 4 (Phase 6)**: Depends on Phase 2; fully independent of US2/US3
- **User Story 5 (Phase 7)**: Depends on Phase 3 (US1 for auth provider + site header changes)
- **Polish (Phase 8)**: Depends on all user stories
- **Testing (Phase 9)**: Unit/component tests can begin as soon as their target files are created; integration/access control tests depend on Phase 2 + Phase 3

### User Story Dependencies

- **US1 (Register/Login)**: No dependencies on other stories — pure MVP
- **US2 (Admin Manages Requests)**: Independent of US1 at data level; needs login flow from US1 for manual testing
- **US3 (User Requests Admin)**: Independent at data level; integrates with US2 (requests appear in admin view)
- **US4 (Edit Profile)**: Fully independent of US2/US3/US5
- **US5 (Role-Based Access)**: Depends on US1 for auth provider; adds to site header from US1

### Within Each User Story

- Data functions before server actions
- Server actions before UI components
- Components before pages

### Parallel Opportunities

- T002, T003, T004, T005 can all run in parallel (Phase 1)
- T006, T007, T008 can all run in parallel (Supabase clients)
- T013 can run in parallel with T009–T012 (validation schemas vs DB schema)
- T016, T017 can run in parallel (independent server actions in separate files)
- T018 depends on its own file (`src/app/(auth)/logout/actions.ts`) — no parallel conflict
- T021, T022 can run in parallel (independent pages)
- US4 (Profile) can run in parallel with US2/US3 (Admin requests)

---

## Parallel Example: Phase 2 Foundation

```
# Supabase clients — all independent files:
T006: Browser client   → src/lib/supabase/client.ts
T007: Server client    → src/lib/supabase/server.ts
T008: Middleware client → src/lib/supabase/middleware.ts

# Can run in parallel with:
T013: Zod schemas → src/lib/validations/auth.ts
```

## Parallel Example: User Story 1

```
# Server actions — T016/T017 parallel, T018 separate file:
T016: registerUser → src/app/(auth)/register/actions.ts
T017: loginUser    → src/app/(auth)/login/actions.ts
T018: logoutUser   → src/app/(auth)/logout/actions.ts

# Pages — independent files:
T021: Register page → src/app/(auth)/register/page.tsx
T022: Login page    → src/app/(auth)/login/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T015)
3. Complete Phase 3: User Story 1 (T016–T026)
4. **STOP and VALIDATE**: Register → Login → Dashboard works end-to-end
5. Deploy/demo if ready — basic auth is live

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Register/Login) → MVP auth ✅
3. Add US2 (Admin Manages Requests) → Role management ✅
4. Add US3 (User Requests Admin) → Full request workflow ✅
5. Add US4 (Edit Profile) → Profile personalization ✅
6. Add US5 (Role-Based Access) → Navigation + access control ✅
7. Polish → Production-ready

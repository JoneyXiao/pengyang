# Research: User Authentication & Role Management

**Feature**: 002-user-auth-management  
**Date**: 2026-04-22  
**Status**: Complete

## 1. Supabase Auth with Next.js App Router

**Decision**: Use `@supabase/ssr` for SSR-compatible session management with HTTP-only cookies.

**Rationale**: `@supabase/ssr` is the official Supabase package for server-side frameworks. It handles cookie-based session storage, token refresh, and works with Next.js middleware. This replaces the deprecated `@supabase/auth-helpers-nextjs`.

**Alternatives considered**:
- NextAuth.js: Would add a separate auth layer on top of Supabase, increasing complexity without benefit since Supabase Auth already provides everything needed.
- Custom JWT implementation: Unnecessary reinvention; Supabase Auth handles JWT issuance, refresh, and validation.

**Key patterns**:
- Three Supabase client types: browser client (`createBrowserClient`), server client (`createServerClient` with `cookies()`), and middleware client (`createServerClient` with `request`/`response` cookies).
- Auth callback route (`/auth/callback`) exchanges auth codes for sessions.
- `@supabase/ssr` uses `getAll` / `setAll` cookie methods for chunked token storage.

## 2. Supabase Email+Password Registration with Username

**Decision**: Use Supabase Auth `signUp` with email+password. Store the display username in a `profiles` table linked by `auth.users.id`.

**Rationale**: Supabase Auth natively supports email+password. The username is a profile-level attribute, not an auth identity, so storing it in a separate `profiles` table keeps auth concerns clean and enables username uniqueness via a Postgres unique constraint.

**Alternatives considered**:
- Storing username in `user_metadata`: Rejected because `user_metadata` is user-editable and unsafe for authorization decisions. It would also bypass database-level uniqueness enforcement.
- Using username as the login identifier: Supabase Auth doesn't natively support username-based login. Would require a custom authentication flow, adding unnecessary complexity.

**Key patterns**:
- On registration: call `supabase.auth.signUp()` with email+password, then insert a `profiles` row with the username via a database trigger (`on auth.users insert`) or in the API route after signup.
- Database trigger approach preferred: a Postgres trigger `on_auth_user_created` automatically creates the profile row, ensuring consistency even if the client-side flow is interrupted.
- Username uniqueness enforced via `UNIQUE` constraint on `profiles.username`.

## 3. Row-Level Security (RLS) Policies

**Decision**: Enable RLS on all tables. Define policies per role using `auth.uid()` and a helper function to check the user's role from the `profiles` table.

**Rationale**: RLS provides database-level access control that can't be bypassed by application code bugs. Combined with application middleware, this creates defense-in-depth.

**Alternatives considered**:
- Application-only authorization: Rejected because a single middleware bug could expose all data. RLS acts as an independent security boundary.
- Using `app_metadata` JWT claims for role checks in RLS: Viable but JWT claims aren't refreshed until token refresh. A helper function that queries the `profiles` table directly ensures real-time role accuracy.

**Key patterns**:
- Create a `public.get_user_role()` SQL function that returns the current user's role from the `profiles` table.
- `profiles` table policies: users can read their own profile; users can update their own profile (except `role` column); super_admin can read/update all profiles.
- `admin_requests` table policies: users can insert their own request; users can read their own requests; super_admin can read/update all requests.
- **Security note**: Never use `raw_user_meta_data` in RLS policies — it's user-editable.

## 4. Super Admin Seed Migration

**Decision**: Create an idempotent seed migration that uses `supabase_admin` (or the Supabase Management API) to create the super admin auth user, then inserts the profile row with `role = 'super_admin'`.

**Rationale**: An automated, version-controlled seed ensures the super admin exists in every environment (dev, staging, prod) without manual steps. Environment variables keep credentials out of the codebase.

**Alternatives considered**:
- Manual dashboard creation: Not repeatable, error-prone across environments, no audit trail.
- CLI setup script: Extra tooling to maintain; a SQL seed is simpler and uses existing Supabase migration infrastructure.

**Key patterns**:
- Seed reads `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from environment.
- Uses `DO $$ ... END $$` block to check if the user already exists before creating (idempotent).
- Assigns `role = 'super_admin'` in the `profiles` table.
- The `super_admin` role in `profiles` is protected: RLS policies prevent any user (including super_admin themselves) from deleting the super_admin profile row.

## 5. Next.js Middleware for Route Protection

**Decision**: Use Next.js middleware (`middleware.ts` at project root) to protect routes based on authentication status and role.

**Rationale**: Middleware runs before the page renders, enabling fast redirects without loading protected page code. Combined with RLS, this provides defense-in-depth: middleware handles UX (redirects, 403), RLS handles data security.

**Alternatives considered**:
- Server Component checks only: Would still render the component shell before redirecting, causing layout flash. Middleware prevents this.
- Layout-level auth checks: Viable for session validation but can't prevent the initial page load. Middleware is the correct layer for route-level auth gating.

**Key patterns**:
- Middleware refreshes the Supabase session on every request (prevents expired sessions from seeing stale pages).
- Public routes (`/`, `/login`, `/register`) are allowlisted.
- Protected routes (`/dashboard`, `/profile`) require an active session — redirect to `/login` if missing.
- Admin routes (`/admin/*`) require super_admin role — redirect to `/dashboard` if insufficient.
- Middleware does NOT perform complex authorization (that's RLS's job) — it only checks session existence and role for UX routing.

## 6. Session Management & Expiry

**Decision**: Use Supabase Auth's built-in session management with a 7-day refresh token expiry.

**Rationale**: Supabase Auth manages JWT access tokens (short-lived, ~1 hour) and refresh tokens (configurable expiry). Setting the refresh token lifetime to 7 days via Supabase dashboard configuration satisfies the spec requirement without custom session management code.

**Alternatives considered**:
- Custom session table: Unnecessary overhead since Supabase Auth already handles session lifecycle.
- Shorter expiry (1 day): Too aggressive for a community site where parents check infrequently.

**Key patterns**:
- Access token: ~1 hour lifetime (Supabase default), automatically refreshed by `@supabase/ssr`.
- Refresh token: 7-day lifetime, configured in Supabase Auth settings.
- Middleware calls `supabase.auth.getUser()` which triggers automatic token refresh if the access token is expired but the refresh token is still valid.
- If both tokens are expired, the user is redirected to `/login`.

## 7. Profile Editing & Default Avatar

**Decision**: Profile editing updates the `profiles` table directly. The default avatar is a static football image stored in `public/images/`.

**Rationale**: Storing a static default avatar path avoids Supabase Storage complexity for the initial feature. Profile updates are simple `UPDATE` operations on the `profiles` table, protected by RLS (users can only update their own row, excluding the `role` column).

**Alternatives considered**:
- Supabase Storage for avatars: Overkill when all users share the same default avatar. Can be added in a future feature for custom avatar uploads.
- Storing avatar as base64 in the database: Inefficient and unnecessary for a single static image.

**Key patterns**:
- `profiles.avatar_url` defaults to `/images/default-avatar.svg` (a football icon).
- Profile form allows editing `username` (with uniqueness re-validation) and `display_name`.
- RLS policy: `auth.uid() = id` for UPDATE, with `role` column excluded from the updatable set via a trigger or policy restriction.

# Quickstart: User Authentication & Role Management

**Feature**: 002-user-auth-management  
**Date**: 2026-04-22

## Prerequisites

- Node.js LTS
- pnpm
- Supabase account (free plan)
- Supabase CLI installed (`brew install supabase/tap/supabase`)

## Setup

### 1. Install dependencies

```bash
pnpm add @supabase/supabase-js @supabase/ssr zod
```

### 2. Configure environment variables

Create or update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your-secure-password
```

### 3. Initialize Supabase locally (optional for local dev)

```bash
supabase init
supabase start
```

### 4. Run database migrations

```bash
supabase db push
```

Or for local development:

```bash
supabase migration up
```

### 5. Seed the super admin

```bash
supabase db seed
```

### 6. Start the development server

```bash
pnpm dev
```

## Verification

1. Open `http://localhost:3000/register` — you should see the registration form
2. Register a new account with email, username, and password
3. Navigate to `http://localhost:3000/login` — log in with your credentials
4. You should be redirected to `/dashboard`
5. Log in as super admin with the seeded credentials — you should see the admin management panel

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/middleware.ts` | Middleware Supabase client |
| `src/app/middleware.ts` | Route protection middleware |
| `src/app/(auth)/login/page.tsx` | Login page |
| `src/app/(auth)/register/page.tsx` | Registration page |
| `src/app/(protected)/dashboard/page.tsx` | User dashboard |
| `supabase/migrations/001_create_profiles_and_requests.sql` | Database schema |
| `supabase/seed.sql` | Super admin seed data |

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

All Supabase clients are mocked in tests. No real database connection is needed.

# Data Layer Contracts: User Authentication & Role Management

**Feature**: 002-user-auth-management  
**Date**: 2026-04-22

## Supabase Client Modules

### `src/lib/supabase/client.ts` — Browser Client

```typescript
// Creates a Supabase client for use in Client Components
export function createClient(): SupabaseClient
```

- Uses `createBrowserClient` from `@supabase/ssr`
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Singleton pattern — returns the same instance across calls

### `src/lib/supabase/server.ts` — Server Client

```typescript
// Creates a Supabase client for use in Server Components, Server Actions, Route Handlers
export async function createClient(): Promise<SupabaseClient>
```

- Uses `createServerClient` from `@supabase/ssr`
- Accesses cookies via `await cookies()` (Next.js async API)
- New instance per request (no caching across requests)

### `src/lib/supabase/middleware.ts` — Middleware Client

```typescript
// Creates a Supabase client for use in Next.js middleware
export function createClient(request: NextRequest): {
  supabase: SupabaseClient
  response: NextResponse
}
```

- Uses `createServerClient` from `@supabase/ssr` with request/response cookie handlers
- Returns both the client and the modified response (for cookie updates)

## Data Access Functions

### `src/lib/data/profiles.ts`

```typescript
// Get the current user's profile
export async function getCurrentProfile(): Promise<Profile | null>

// Get a profile by user ID (super_admin only — enforced by RLS)
export async function getProfileById(userId: string): Promise<Profile | null>

// Get all profiles (super_admin only — enforced by RLS)
export async function getAllProfiles(): Promise<Profile[]>

// Update the current user's profile
export async function updateProfile(data: {
  username?: string
  display_name?: string
}): Promise<Profile>
```

### `src/lib/data/admin-requests.ts`

```typescript
// Get the current user's admin request (latest)
export async function getMyAdminRequest(): Promise<AdminRequest | null>

// Get all pending admin requests (super_admin only — enforced by RLS)
export async function getPendingRequests(): Promise<AdminRequestWithProfile[]>

// Submit an admin role request
export async function submitAdminRequest(): Promise<AdminRequest>

// Approve an admin request (super_admin only)
export async function approveRequest(requestId: string): Promise<void>

// Reject an admin request (super_admin only)
export async function rejectRequest(requestId: string): Promise<void>

// Demote an admin user to regular (super_admin only)
export async function demoteUser(userId: string): Promise<void>
```

## TypeScript Types

### `src/lib/types/index.ts` (extensions)

```typescript
export type UserRole = 'regular' | 'admin' | 'super_admin'

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  role: UserRole
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface AdminRequest {
  id: string
  user_id: string
  status: RequestStatus
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

export interface AdminRequestWithProfile extends AdminRequest {
  profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>
}
```

## Zod Validation Schemas

### `src/lib/validations/auth.ts`

```typescript
export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z.string()
    .min(2, '用户名至少需要2个字符')
    .max(30, '用户名不能超过30个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名仅支持字母、数字和下划线'),
  password: z.string().min(8, '密码至少需要8个字符'),
})

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

export const profileSchema = z.object({
  username: z.string()
    .min(2, '用户名至少需要2个字符')
    .max(30, '用户名不能超过30个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名仅支持字母、数字和下划线')
    .optional(),
  display_name: z.string()
    .max(50, '显示名称不能超过50个字符')
    .nullable()
    .optional(),
})
```

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser + server) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser + server) | Supabase anon/public key |
| `SUPER_ADMIN_EMAIL` | Server only (seed) | Super admin email for seeding |
| `SUPER_ADMIN_PASSWORD` | Server only (seed) | Super admin password for seeding |

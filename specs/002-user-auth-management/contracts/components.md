# Component Contracts: User Authentication & Role Management

**Feature**: 002-user-auth-management  
**Date**: 2026-04-22

## Route Contracts

### Public Routes (no auth required)

| Route | Method | Description |
|-------|--------|-------------|
| `/login` | GET | Login page with email/password form |
| `/register` | GET | Registration page with email/username/password form |
| `/auth/callback` | GET | Supabase auth callback — exchanges code for session |

### Protected Routes (auth required)

| Route | Method | Role Required | Description |
|-------|--------|---------------|-------------|
| `/dashboard` | GET | any authenticated | User dashboard with role-specific content |
| `/profile` | GET | any authenticated | Profile viewing and editing |
| `/admin/requests` | GET | super_admin | Pending admin request management |
| `/admin/users` | GET | super_admin | User list and role management |

### Middleware Route Matching

```
/dashboard/*    → requires session, any role
/profile/*      → requires session, any role
/admin/*        → requires session, super_admin role
/login          → redirect to /dashboard if already authenticated
/register       → redirect to /dashboard if already authenticated
```

## Server Action Contracts

### Auth Actions

#### `registerUser(formData)`
- **Input**: `{ email: string, username: string, password: string }`
- **Validation**: Zod schema — email valid, username 2-30 chars alphanumeric+underscore, password ≥8 chars
- **Success**: Creates auth user + profile row, redirects to `/login`
- **Errors**: duplicate email (generic message), duplicate username (specific message), weak password

#### `loginUser(formData)`
- **Input**: `{ email: string, password: string }`
- **Validation**: Zod schema — email valid, password non-empty
- **Success**: Creates session, redirects to `/dashboard`
- **Errors**: generic "邮箱或密码错误" (never reveals which is wrong)

#### `logoutUser()`
- **Input**: none
- **Success**: Destroys session, redirects to `/login`

### Profile Actions

#### `updateProfile(formData)`
- **Input**: `{ username?: string, display_name?: string }`
- **Validation**: Zod schema — username 2-30 chars if provided, display_name ≤50 chars if provided
- **Auth**: requires session, updates own profile only
- **Success**: Updates profile row, returns updated data
- **Errors**: duplicate username, validation errors

### Admin Request Actions

#### `submitAdminRequest()`
- **Input**: none (user_id from session)
- **Auth**: requires session, role = regular
- **Success**: Creates pending request, returns confirmation
- **Errors**: already has pending request, already an admin

#### `resolveAdminRequest(formData)`
- **Input**: `{ request_id: string, action: 'approve' | 'reject' }`
- **Auth**: requires session, role = super_admin
- **Success**: Updates request status; if approved, updates user role to admin
- **Errors**: request not found, request already resolved

#### `demoteUser(formData)`
- **Input**: `{ user_id: string }`
- **Auth**: requires session, role = super_admin
- **Success**: Updates user role from admin to regular
- **Errors**: user is super_admin (protected), user is already regular

## Component Contracts

### Auth Components

#### `<LoginForm />`
- **Type**: Client Component (`'use client'`)
- **Props**: none
- **State**: email, password, error message, loading
- **Behavior**: Submits to `loginUser` server action, shows inline errors, redirects on success

#### `<RegisterForm />`
- **Type**: Client Component (`'use client'`)
- **Props**: none
- **State**: email, username, password, error messages, loading
- **Behavior**: Submits to `registerUser` server action, shows inline errors per field, redirects to `/login` on success

#### `<AuthProvider />`
- **Type**: Client Component (`'use client'`)
- **Props**: `{ children: ReactNode }`
- **Context**: Provides `{ user, profile, isLoading }` via React context
- **Behavior**: Listens to Supabase auth state changes, fetches profile on auth change

### Dashboard Components

#### `<RoleBadge />`
- **Type**: Server Component
- **Props**: `{ role: 'regular' | 'admin' | 'super_admin' }`
- **Renders**: Styled badge with role label in Chinese

#### `<AdminRequestCard />`
- **Type**: Server Component
- **Props**: `{ request: { status, created_at, resolved_at } }`
- **Renders**: Card showing request status and dates

#### `<AdminRequestList />`
- **Type**: Client Component (`'use client'`)
- **Props**: `{ requests: AdminRequest[] }`
- **Behavior**: Renders list of pending requests with approve/reject buttons, calls `resolveAdminRequest` action

### Profile Components

#### `<ProfileForm />`
- **Type**: Client Component (`'use client'`)
- **Props**: `{ profile: Profile }`
- **State**: username, display_name, error messages, loading
- **Behavior**: Submits to `updateProfile` server action, shows inline errors, optimistic UI update

### Layout Components

#### `<UserNav />`
- **Type**: Client Component (`'use client'`)
- **Props**: none (reads from AuthProvider context)
- **Renders**: Avatar + dropdown with profile link, role-specific nav items, and logout button

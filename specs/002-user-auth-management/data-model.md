# Data Model: User Authentication & Role Management

**Feature**: 002-user-auth-management  
**Date**: 2026-04-22

## Entities

### 1. Profile (`profiles`)

Stores user profile data linked to Supabase Auth identity.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PK, FK → `auth.users.id`, `ON DELETE CASCADE` | Auth user identifier |
| `username` | `text` | `NOT NULL`, `UNIQUE`, length 2–30 | Display username |
| `display_name` | `text` | nullable | Optional friendly display name |
| `role` | `user_role` (enum) | `NOT NULL`, default `'regular'` | One of: `regular`, `admin`, `super_admin` |
| `avatar_url` | `text` | `NOT NULL`, default `'/images/default-avatar.svg'` | Profile avatar URL |
| `created_at` | `timestamptz` | `NOT NULL`, default `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | `NOT NULL`, default `now()` | Last profile update timestamp |

**Enum `user_role`**: `'regular'` | `'admin'` | `'super_admin'`

**Relationships**:
- 1:1 with `auth.users` via `id` (cascade delete)
- 1:many with `admin_requests` via `admin_requests.user_id`

**State transitions for `role`**:
- `regular` → `admin` (super admin approves request)
- `admin` → `regular` (super admin demotes)
- `super_admin` — immutable (cannot be changed or deleted)

**Triggers**:
- `on_auth_user_created`: Automatically creates a `profiles` row when a new auth user is registered. Sets `username` from registration metadata, `role` to `'regular'`, `avatar_url` to default.
- `on_profile_updated`: Automatically updates `updated_at` timestamp on any profile change.

### 2. Admin Request (`admin_requests`)

Tracks user requests for admin role promotion.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Request identifier |
| `user_id` | `uuid` | `NOT NULL`, FK → `profiles.id`, `ON DELETE CASCADE` | Requesting user |
| `status` | `request_status` (enum) | `NOT NULL`, default `'pending'` | Request status |
| `created_at` | `timestamptz` | `NOT NULL`, default `now()` | Request submission time |
| `resolved_at` | `timestamptz` | nullable | When request was approved/rejected |
| `resolved_by` | `uuid` | nullable, FK → `profiles.id` | Super admin who resolved |

**Enum `request_status`**: `'pending'` | `'approved'` | `'rejected'`

**Constraints**:
- Unique partial index: `UNIQUE(user_id) WHERE status = 'pending'` — enforces one pending request per user (FR-009).

**Relationships**:
- many:1 with `profiles` via `user_id`
- many:1 with `profiles` via `resolved_by` (nullable — only set on resolution)

**State transitions for `status`**:
- `pending` → `approved` (super admin approves; triggers `role` update on `profiles`)
- `pending` → `rejected` (super admin rejects)
- Terminal states: `approved` and `rejected` are final — no further transitions.

## RLS Policies

### `profiles` table

| Policy | Action | Check | Description |
|--------|--------|-------|-------------|
| `profiles_select_own` | SELECT | `auth.uid() = id` | Users can read their own profile |
| `profiles_select_admin` | SELECT | `get_user_role() = 'super_admin'` | Super admin can read all profiles |
| `profiles_update_own` | UPDATE | `auth.uid() = id` | Users can update their own profile (excluding `role`) |
| `profiles_update_admin` | UPDATE | `get_user_role() = 'super_admin'` | Super admin can update any profile (including `role`) |
| `profiles_delete_protect` | DELETE | `false` | No user can delete profiles via API (deletions only via auth cascade) |

### `admin_requests` table

| Policy | Action | Check | Description |
|--------|--------|-------|-------------|
| `requests_insert_own` | INSERT | `auth.uid() = user_id` | Users can create their own requests |
| `requests_select_own` | SELECT | `auth.uid() = user_id` | Users can read their own requests |
| `requests_select_admin` | SELECT | `get_user_role() = 'super_admin'` | Super admin can read all requests |
| `requests_update_admin` | UPDATE | `get_user_role() = 'super_admin'` | Super admin can update request status |

## Helper Functions

### `get_user_role()`

```sql
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;
```

**Note**: `SECURITY DEFINER` with empty `search_path` follows Supabase best practices. This function is used in RLS policies to check the current user's role in real-time (not from JWT claims).

### `handle_new_user()`

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    'regular',
    '/images/default-avatar.svg'
  );
  RETURN NEW;
END;
$$;
```

Triggered by: `CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`

## Validation Rules

| Field | Rule | Error |
|-------|------|-------|
| `username` | 2–30 characters, alphanumeric + underscores only | "用户名必须为2-30个字符，仅支持字母、数字和下划线" |
| `username` | Unique (case-insensitive) | "该用户名已被使用" |
| `email` | Valid email format | "请输入有效的邮箱地址" |
| `password` | Minimum 8 characters | "密码至少需要8个字符" |
| `display_name` | 1–50 characters (if provided) | "显示名称不能超过50个字符" |

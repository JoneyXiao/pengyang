---
name: Fix 4 UI/Config Issues
overview: "Address four issues: Beijing timezone for match creation, mobile menu background visibility, dashboard/match-management route renaming, and admin dropdown on public navbar."
todos:
  - id: tz-fix
    content: Append +08:00 offset to match_date in create and edit forms; convert stored UTC back to Asia/Shanghai for edit defaultValue
    status: completed
  - id: mobile-bg
    content: Fix mobile menu overlay background to be opaque (bg-[#FFFFFF]) in Navbar.tsx
    status: completed
  - id: rename-routes
    content: Delete old dashboard.tsx, rename match-management.tsx to dashboard.tsx, update route path and sidebar nav items
    status: completed
  - id: admin-dropdown
    content: Replace direct admin Link with DropdownMenu showing admin nav items on desktop; add admin link list in mobile menu
    status: completed
isProject: false
---

# Fix 4 UI/Config Issues

## Issue 1: Beijing timezone (GMT+8) for match creation

**Problem:** The `datetime-local` input sends a naive datetime string (e.g. `2026-05-01T15:00`) with no timezone offset. The backend stores it in a `TIMESTAMP WITH TIME ZONE` column, but without an explicit offset, Postgres interprets it based on the server's `timezone` setting, which may not be `Asia/Shanghai` in production.

**Solution:** Append `+08:00` to the datetime string on the frontend before sending it to the API. This ensures the match time is always interpreted as Beijing time regardless of server config.

**Files to change:**
- [`frontend/src/routes/_layout/match-management.tsx`](frontend/src/routes/_layout/match-management.tsx) -- In both `handleCreate` and `EditMatchInline.handleSubmit`, append `+08:00` to the `match_date` value from the `datetime-local` input before sending. Also, when populating the edit form's `defaultValue`, convert the stored UTC datetime to Beijing local time using `toLocaleString` with `timeZone: "Asia/Shanghai"` and format it as `YYYY-MM-DDTHH:mm`.

After renaming (Issue 3), this file becomes `dashboard.tsx`.

---

## Issue 2: Mobile menu background not visible

**Problem:** The screenshot shows the mobile nav overlay is transparent -- page content (match card, countdown, etc.) bleeds through behind the nav links. The current code uses `bg-white` on the overlay, but it appears ineffective.

**Solution:** Ensure the mobile overlay has an opaque, explicit background. Replace `bg-white` with a hardcoded `bg-[#FFFFFF]` (to avoid any CSS variable issues) and verify the `z-40` stacking context is above all page content. Also ensure the overlay fills the viewport properly.

**File to change:**
- [`frontend/src/components/Public/Navbar.tsx`](frontend/src/components/Public/Navbar.tsx) -- Change the mobile overlay `<div>` (line ~107) background class from `bg-white` to `bg-[#FFFFFF]` to guarantee opacity.

---

## Issue 3: Remove dashboard, rename match-management to dashboard

**Problem:** The current `/dashboard` route is a simple greeting page with no real functionality. The user wants `/match-management` (the full match management UI) to become the new `/dashboard`.

**Steps:**

1. **Delete** [`frontend/src/routes/_layout/dashboard.tsx`](frontend/src/routes/_layout/dashboard.tsx) (the greeting page).
2. **Rename** [`frontend/src/routes/_layout/match-management.tsx`](frontend/src/routes/_layout/match-management.tsx) to `frontend/src/routes/_layout/dashboard.tsx`.
3. Inside the renamed file, update the route path from `/_layout/match-management` to `/_layout/dashboard` and update the page title meta from `"比赛管理 - 鹏飏"` to `"仪表盘 - 鹏飏"` (or keep `"比赛管理"` -- user preference).
4. In [`frontend/src/components/Sidebar/AppSidebar.tsx`](frontend/src/components/Sidebar/AppSidebar.tsx) -- Update the `footballItems` entry from `{ path: "/match-management", title: "比赛管理" }` to `{ path: "/dashboard", title: "比赛管理" }`, and remove the old `{ path: "/dashboard", title: "仪表盘" }` from `baseItems`.
5. Run `npx tsr generate` (or let Vite's TanStack Router plugin auto-regenerate the route tree) to update `routeTree.gen.ts`.

**No other files need updating** -- login redirect already targets `/dashboard`, and the public navbar already links to `/dashboard`.

---

## Issue 4: Admin dropdown on public navbar

**Problem:** The admin button (User icon) on public pages currently navigates directly to `/dashboard`. The user wants a dropdown menu showing admin navigation items with links.

**Solution:** Replace the direct `<Link>` with a `DropdownMenu` (already available via shadcn at [`frontend/src/components/ui/dropdown-menu.tsx`](frontend/src/components/ui/dropdown-menu.tsx)).

**File to change:**
- [`frontend/src/components/Public/Navbar.tsx`](frontend/src/components/Public/Navbar.tsx)

**Desktop:** Wrap the User icon button with `DropdownMenuTrigger`, and render a `DropdownMenuContent` with items mirroring the sidebar admin links:
- 仪表盘 -> `/dashboard`
- 球队介绍 -> `/team-content`
- 教练管理 -> `/coaches`
- 球员管理 -> `/players`

Show these only when `loggedIn` is true. When not logged in, keep the direct link to `/login`.

**Mobile:** In the full-screen mobile menu, replace the single "进入管理" button with an expandable section or list of the same admin links when logged in.

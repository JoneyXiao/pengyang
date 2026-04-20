# Component Contracts

**Feature**: 001-landing-page  
**Date**: 2026-04-19

This contract defines the props interface for each landing page component.

## Layout Components

### `SiteHeader`

Sticky top navigation bar. Server Component wrapper with a Client Component mobile nav sheet.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `navItems` | `NavItem[]` | Yes | Navigation links to display |
| `badgeUrl` | `string` | Yes | Team badge image URL |

### `SiteFooter`

Dark footer with school info, quick links, and contact.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `navItems` | `NavItem[]` | Yes | Quick links |
| `teamName` | `string` | Yes | Full school/team name |
| `badgeUrl` | `string` | Yes | Team badge image URL |
| `contactAddress` | `string` | Yes | School address |
| `contactEmail` | `string` | Yes | General contact email |

### `MobileNavSheet`

Client Component (`"use client"`). Slide-in sheet triggered by hamburger icon.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `navItems` | `NavItem[]` | Yes | Navigation links |

## Landing Page Sections

### `HeroSection`

Full-width hero with action photo, team name, tagline, and CTA.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `teamName` | `string` | Yes | Team display name |
| `tagline` | `string` | Yes | Team tagline |
| `imageUrl` | `string \| null` | Yes | Hero photo URL (null → green fallback) |
| `imageAlt` | `string` | Yes | Alt text for hero image |

### `MatchesSection`

Section displaying upcoming match cards with heading and "查看赛程" link.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `matches` | `Match[]` | Yes | Upcoming matches (may be empty) |
| `title` | `string` | Yes | Section heading text |

### `ResultsSection`

Section displaying recent result cards with heading.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `matches` | `Match[]` | Yes | Completed matches (may be empty) |
| `title` | `string` | Yes | Section heading text |

### `TeamIntroSection`

Team introduction with photo, description, and "了解更多" link.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `profile` | `TeamProfile` | Yes | Team profile data |

### `EmptyState`

Reusable empty-state message for sections with no data.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Message to display, e.g., "暂无赛事安排" |

## UI Components

### `MatchCard`

A single match card — handles both upcoming and completed variants.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `match` | `Match` | Yes | Match data |

**Behavior**:
- Displays both team names (Pengyang always first)
- Shows score in monospace font if `status === 'completed'` or `status === 'live'`
- Shows venue and date in secondary text
- Entire card is a clickable link to `/matches/{match.id}`
- Hover: lifts to Level 3 shadow with -2px translateY

### `StatusBadge`

Colored badge indicating match status.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `MatchStatus` | Yes | One of: `upcoming`, `live`, `completed`, `cancelled` |

**Behavior**:
- `live`: red background, pulsing dot animation
- `upcoming`: sky-blue background
- `completed`: green background
- `cancelled`: zinc background

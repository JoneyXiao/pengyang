# Data Model: Landing Page

**Feature**: 001-landing-page  
**Date**: 2026-04-19

## Entities

### Match

Represents a single football match involving the Pengyang team.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the match |
| `homeTeam` | `string` | Yes | Home team name (always "鹏飏" when Pengyang is home) |
| `awayTeam` | `string` | Yes | Away team name |
| `dateTime` | `string` (ISO 8601) | Yes | Match date and time, e.g., `"2026-04-20T15:00:00+08:00"` |
| `venue` | `string` | Yes | Match location, e.g., `"观湖实验学校足球场"` |
| `status` | `MatchStatus` | Yes | Current match state: `"upcoming"`, `"live"`, `"completed"`, `"cancelled"` |
| `homeScore` | `number \| null` | No | Home team score (null if match not yet played) |
| `awayScore` | `number \| null` | No | Away team score (null if match not yet played) |
| `isPengyangHome` | `boolean` | Yes | Whether Pengyang is the home team (determines display order) |

**Display rule**: On match cards, Pengyang is always shown first regardless of home/away. If `isPengyangHome` is `true`, display as `homeTeam vs awayTeam`; if `false`, display as `awayTeam vs homeTeam` (Pengyang's name and score first).

**Validation rules**:
- `dateTime` must be a valid ISO 8601 string
- `status` must be one of the four allowed values
- `homeScore` and `awayScore` must be non-negative integers or null
- Both scores must be null if `status` is `"upcoming"` or `"cancelled"`
- Both scores must be non-negative integers if `status` is `"completed"`
- For `"live"` status, scores may be present (current score) or null (just started)

**State transitions**:
```
upcoming → live → completed
upcoming → cancelled
```

### TeamProfile

The Pengyang Football team's public identity shown on the landing page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Team display name, e.g., `"鹏飏足球"` |
| `fullName` | `string` | Yes | Full official name, e.g., `"深圳市龙华观湖实验学校鹏飏足球队"` |
| `tagline` | `string` | Yes | Team tagline, e.g., `"友谊第一，比赛第二"` |
| `description` | `string` | Yes | Brief team introduction paragraph (Chinese) |
| `heroImageUrl` | `string \| null` | No | URL of the hero action photo (null triggers fallback) |
| `heroImageAlt` | `string` | Yes | Alt text for the hero image |
| `teamPhotoUrl` | `string \| null` | No | URL of the team introduction photo |
| `teamPhotoAlt` | `string` | Yes | Alt text for the team photo |
| `badgeUrl` | `string` | Yes | URL of the team badge/crest image |
| `contactAddress` | `string` | Yes | School address displayed in footer, e.g., `"深圳市龙华区观湖街道观湖实验学校"` |
| `contactEmail` | `string` | Yes | General contact email displayed in footer, e.g., `"pengyang@example.edu.cn"` |

**Validation rules**:
- `name` and `fullName` must be non-empty strings
- Image URLs, if present, must be valid URL strings
- Alt text fields must always be present (accessibility requirement)

### NavItem

A navigation link used in the site header and footer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Display text, e.g., `"赛程"` |
| `href` | `string` | Yes | Destination path, e.g., `"/schedule"` |
| `isExternal` | `boolean` | No | Whether the link opens in a new tab (default: `false`) |

## Enumerations

### MatchStatus

```typescript
type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled'
```

| Value | Description | Badge Style |
|-------|-------------|-------------|
| `upcoming` | Match is scheduled but not started | Sky Blue background, sky-600 text |
| `live` | Match is currently in progress | Red-100 background, red-600 text, pulsing dot |
| `completed` | Match has finished | Green-100 background, green-600 text |
| `cancelled` | Match was cancelled | Zinc-100 background, zinc-500 text |

## Relationships

```
TeamProfile (1) ──── displays on ──── (1) Landing Page
Match (0..n) ──── shown in ──── (1) Upcoming Matches Section (up to 3)
Match (0..n) ──── shown in ──── (1) Recent Results Section (up to 3)
NavItem (1..n) ──── rendered in ──── (1) Site Header
NavItem (1..n) ──── rendered in ──── (1) Site Footer
```

## TypeScript Type Definitions

```typescript
// src/lib/types/index.ts

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled'

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  dateTime: string // ISO 8601
  venue: string
  status: MatchStatus
  homeScore: number | null
  awayScore: number | null
  isPengyangHome: boolean
}

export interface TeamProfile {
  name: string
  fullName: string
  tagline: string
  description: string
  heroImageUrl: string | null
  heroImageAlt: string
  teamPhotoUrl: string | null
  teamPhotoAlt: string
  badgeUrl: string
  contactAddress: string
  contactEmail: string
}

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}
```

## Seed Data Shape (Fixtures)

### matches.json

```json
[
  {
    "id": "match-001",
    "homeTeam": "鹏飏",
    "awayTeam": "龙华中心小学",
    "dateTime": "2026-04-25T15:00:00+08:00",
    "venue": "观湖实验学校足球场",
    "status": "upcoming",
    "homeScore": null,
    "awayScore": null,
    "isPengyangHome": true
  },
  {
    "id": "match-002",
    "homeTeam": "民治小学",
    "awayTeam": "鹏飏",
    "dateTime": "2026-04-12T14:30:00+08:00",
    "venue": "民治小学运动场",
    "status": "completed",
    "homeScore": 1,
    "awayScore": 3,
    "isPengyangHome": false
  }
]
```

### team.json

```json
{
  "name": "鹏飏足球",
  "fullName": "深圳市龙华观湖实验学校鹏飏足球队",
  "tagline": "友谊第一，比赛第二",
  "description": "鹏飏足球队成立于深圳市龙华区观湖实验学校，由热爱足球的小学生组成。我们秉承"友谊第一，比赛第二"的精神，在绿茵场上追逐梦想，享受足球带来的快乐与成长。",
  "heroImageUrl": "/images/hero-match.jpg",
  "heroImageAlt": "鹏飏足球队比赛精彩瞬间",
  "teamPhotoUrl": "/images/team-photo.jpg",
  "teamPhotoAlt": "鹏飏足球队全体队员合影",
  "badgeUrl": "/images/badge.png",
  "contactAddress": "深圳市龙华区观湖街道观湖实验学校",
  "contactEmail": "pengyang@example.edu.cn"
}
```

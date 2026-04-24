# Data Model: Football School Team Website

**Feature**: 001-football-school-website
**Date**: 2026-04-23

## Entity Relationship Overview

```
User (existing)
 └── 1:N → Coach (created_by)
 └── 1:N → Player (created_by)
 └── 1:N → Match (created_by)

TeamContent (singleton)

Coach
Player (has_parental_consent flag)

Match
 ├── 1:N → MatchUpdate
 └── 1:N → MatchMedia
```

## Entities

### TeamContent

Singleton record holding the team introduction page content.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| content | Text | NOT NULL | Rich text HTML content |
| updated_at | DateTime(tz) | NOT NULL | Last edit timestamp |
| updated_by_id | UUID | FK → User.id, NOT NULL | Admin who last edited |

**Validation rules**:
- `content` must not be empty.
- HTML content is sanitized server-side before storage (strip scripts, event handlers).

---

### Coach

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| name | String(255) | NOT NULL | Full name |
| role | String(100) | NOT NULL | e.g., "主教练", "助理教练" |
| biography | Text | nullable | Rich text or plain text bio |
| photo_url | String(500) | nullable | Path to uploaded photo |
| sort_order | Integer | NOT NULL, default 0 | Display ordering |
| created_at | DateTime(tz) | NOT NULL, default now | |
| updated_at | DateTime(tz) | NOT NULL, default now | |

**Validation rules**:
- `name` must be 1-255 characters.
- `role` must be 1-100 characters.
- `photo_url`, if provided, must point to a valid uploaded image path.

---

### Player

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| name | String(255) | NOT NULL | Full name (admin-only if no consent) |
| first_name | String(100) | NOT NULL | First name (always public) |
| position | String(50) | nullable | e.g., "前锋", "守门员" |
| jersey_number | Integer | nullable | |
| biography | Text | nullable | Bio (hidden if no consent) |
| photo_url | String(500) | nullable | Photo (hidden if no consent) |
| has_parental_consent | Boolean | NOT NULL, default false | Controls public profile visibility |
| sort_order | Integer | NOT NULL, default 0 | Display ordering |
| created_at | DateTime(tz) | NOT NULL, default now | |
| updated_at | DateTime(tz) | NOT NULL, default now | |

**Validation rules**:
- `name` must be 1-255 characters.
- `first_name` must be 1-100 characters.
- `jersey_number`, if provided, must be 1-99.
- Public API: if `has_parental_consent` is false, only `first_name` and `jersey_number` are returned.

---

### Match

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| match_date | DateTime(tz) | NOT NULL, indexed | Scheduled kickoff time |
| home_team | String(255) | NOT NULL | Always 观湖实验学校 or configurable |
| away_team | String(255) | NOT NULL | Opposing team name |
| status | String(20) | NOT NULL, default "upcoming", indexed | Enum: upcoming, live, completed |
| home_score | Integer | nullable | |
| away_score | Integer | nullable | |
| precautions | Text | nullable | Safety notes, venue info |
| created_at | DateTime(tz) | NOT NULL, default now | |
| updated_at | DateTime(tz) | NOT NULL, default now | |
| created_by_id | UUID | FK → User.id, NOT NULL | Admin who created |

**Validation rules**:
- `status` must be one of: "upcoming", "live", "completed".
- `home_team` and `away_team` must be 1-255 characters.
- `home_score` and `away_score`, if provided, must be ≥ 0.

**State transitions** (manual admin toggle):
```
upcoming → live → completed
upcoming → completed (skip live for historical records)
```

**Indexes**:
- `ix_match_status` on `status`
- `ix_match_match_date` on `match_date`

---

### MatchUpdate

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| match_id | UUID | FK → Match.id, NOT NULL, indexed | |
| content | Text | NOT NULL | Update text (e.g., "第23分钟，进球！") |
| created_at | DateTime(tz) | NOT NULL, default now | Timestamp of the update |

**Validation rules**:
- `content` must not be empty, max 1000 characters.

**Indexes**:
- `ix_matchupdate_match_id_created_at` on (`match_id`, `created_at`)

**Relationships**:
- Match 1:N MatchUpdate (cascade delete)

---

### MatchMedia

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default uuid4 | |
| match_id | UUID | FK → Match.id, NOT NULL, indexed | |
| media_type | String(10) | NOT NULL | Enum: "photo", "video" |
| file_path | String(500) | nullable | For photos: path to uploaded file |
| url | String(1000) | nullable | For videos: external URL |
| caption | String(500) | nullable | Optional description |
| title | String(255) | nullable | For videos: link title |
| sort_order | Integer | NOT NULL, default 0 | Display ordering |
| created_at | DateTime(tz) | NOT NULL, default now | |

**Validation rules**:
- `media_type` must be "photo" or "video".
- If `media_type` is "photo", `file_path` must not be null.
- If `media_type` is "video", `url` must not be null and must be a valid URL.
- Photo file types: JPEG, PNG, WebP. Max size: 10MB (validated server-side).
- `caption`, if provided, max 500 characters.

**Indexes**:
- `ix_matchmedia_match_id` on `match_id`

**Relationships**:
- Match 1:N MatchMedia (cascade delete)

## Migration Strategy

Single Alembic migration creating all new tables:
1. `team_content` table
2. `coach` table
3. `player` table
4. `match` table (with indexes on `status`, `match_date`)
5. `matchupdate` table (with composite index on `match_id` + `created_at`)
6. `matchmedia` table (with index on `match_id`)

Seed data: Create an initial TeamContent record with placeholder content so the team intro page is never empty.

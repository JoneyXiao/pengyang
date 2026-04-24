# API Contracts: Football School Team Website

**Feature**: 001-football-school-website
**Base path**: `/api/v1`
**Auth**: JWT Bearer token (existing) for admin endpoints. Public endpoints require no auth.

---

## Public Endpoints (No Auth)

### GET /api/v1/public/landing

Landing page aggregate data.

**Response 200**:
```json
{
  "upcoming_matches": [
    {
      "id": "uuid",
      "match_date": "2026-05-01T15:00:00+08:00",
      "home_team": "观湖实验学校",
      "away_team": "对手学校",
      "status": "upcoming",
      "home_score": null,
      "away_score": null
    }
  ],
  "recent_matches": [
    {
      "id": "uuid",
      "match_date": "2026-04-20T15:00:00+08:00",
      "home_team": "观湖实验学校",
      "away_team": "某某学校",
      "status": "completed",
      "home_score": 3,
      "away_score": 1
    }
  ],
  "team_name": "深圳市龙华区观湖实验学校 - 鹏飏"
}
```

---

### GET /api/v1/public/team-content

Team introduction page content.

**Response 200**:
```json
{
  "content": "<h2>球队历史</h2><p>...</p>",
  "updated_at": "2026-04-22T10:00:00+08:00"
}
```

---

### GET /api/v1/public/coaches

List all coaches (public).

**Query params**: None (small dataset, no pagination needed)

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "张教练",
      "role": "主教练",
      "biography": "...",
      "photo_url": "/uploads/coaches/abc.jpg",
      "sort_order": 0
    }
  ],
  "count": 3
}
```

---

### GET /api/v1/public/players

List all players (public, consent-filtered).

**Query params**: None

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "小明",
      "position": "前锋",
      "jersey_number": 10,
      "biography": "...",
      "photo_url": "/uploads/players/xyz.jpg",
      "has_full_profile": true
    },
    {
      "id": "uuid",
      "first_name": "小红",
      "position": null,
      "jersey_number": 7,
      "biography": null,
      "photo_url": null,
      "has_full_profile": false
    }
  ],
  "count": 15
}
```

Note: Players without parental consent have `biography`, `photo_url` set to `null` and `has_full_profile: false`.

---

### GET /api/v1/public/matches

List all matches (public).

**Query params**:
- `status` (optional): Filter by "upcoming", "live", "completed"
- `skip` (optional, default 0): Pagination offset
- `limit` (optional, default 20): Page size

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "match_date": "2026-05-01T15:00:00+08:00",
      "home_team": "观湖实验学校",
      "away_team": "对手学校",
      "status": "upcoming",
      "home_score": null,
      "away_score": null,
      "precautions": "注意防晒"
    }
  ],
  "count": 25
}
```

---

### GET /api/v1/public/matches/{match_id}

Match detail (public).

**Response 200**:
```json
{
  "id": "uuid",
  "match_date": "2026-04-20T15:00:00+08:00",
  "home_team": "观湖实验学校",
  "away_team": "某某学校",
  "status": "completed",
  "home_score": 3,
  "away_score": 1,
  "precautions": "注意防晒",
  "updates": [
    {
      "id": "uuid",
      "content": "第10分钟，主队进球！1-0",
      "created_at": "2026-04-20T15:10:00+08:00"
    }
  ],
  "media": [
    {
      "id": "uuid",
      "media_type": "photo",
      "file_path": "/uploads/matches/abc/photo1.jpg",
      "caption": "进球瞬间",
      "sort_order": 0
    },
    {
      "id": "uuid",
      "media_type": "video",
      "url": "https://www.bilibili.com/video/BV1xx...",
      "title": "比赛精彩集锦",
      "caption": null,
      "sort_order": 1
    }
  ]
}
```

**Response 404**: `{ "detail": "Match not found" }`

---

### GET /api/v1/public/matches/{match_id}/updates

Match updates only (used for polling).

**Query params**:
- `after` (optional): ISO datetime — return only updates after this timestamp

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "第45分钟，半场结束。2-1",
      "created_at": "2026-04-20T15:45:00+08:00"
    }
  ],
  "count": 5
}
```

---

## Admin Endpoints (Auth Required)

All admin endpoints require `Authorization: Bearer <token>` header. User must be `is_superuser: true`.

### Coaches CRUD

#### POST /api/v1/coaches
Create a coach.

**Request**: `multipart/form-data`
- `name` (string, required)
- `role` (string, required)
- `biography` (string, optional)
- `photo` (file, optional): JPEG/PNG/WebP, max 10MB
- `sort_order` (integer, optional, default 0)

**Response 201**: Coach object (full)
**Response 422**: Validation error

#### GET /api/v1/coaches
List all coaches (admin, full data).

**Response 200**: `{ "data": [...], "count": N }`

#### PATCH /api/v1/coaches/{coach_id}
Update a coach.

**Request**: `multipart/form-data` (all fields optional)
**Response 200**: Updated coach
**Response 404**: `{ "detail": "Coach not found" }`

#### DELETE /api/v1/coaches/{coach_id}
**Response 200**: `{ "message": "Coach deleted" }`
**Response 404**: `{ "detail": "Coach not found" }`

---

### Players CRUD

#### POST /api/v1/players
Create a player.

**Request**: `multipart/form-data`
- `name` (string, required): Full name
- `first_name` (string, required): First name (always public)
- `position` (string, optional)
- `jersey_number` (integer, optional)
- `biography` (string, optional)
- `photo` (file, optional): JPEG/PNG/WebP, max 10MB
- `has_parental_consent` (boolean, required)
- `sort_order` (integer, optional, default 0)

**Response 201**: Player object (full, admin view)
**Response 422**: Validation error

#### GET /api/v1/players
List all players (admin, full data including consent status).

**Response 200**: `{ "data": [...], "count": N }`

#### PATCH /api/v1/players/{player_id}
Update a player.

**Request**: `multipart/form-data` (all fields optional)
**Response 200**: Updated player (full)
**Response 404**: `{ "detail": "Player not found" }`

#### DELETE /api/v1/players/{player_id}
**Response 200**: `{ "message": "Player deleted" }`
**Response 404**: `{ "detail": "Player not found" }`

---

### Matches CRUD

#### POST /api/v1/matches
Create a match.

**Request**:
```json
{
  "match_date": "2026-05-01T15:00:00+08:00",
  "home_team": "观湖实验学校",
  "away_team": "对手学校",
  "precautions": "注意防晒"
}
```

**Response 201**: Match object (status defaults to "upcoming")
**Response 422**: Validation error

#### GET /api/v1/matches
List matches (admin).

**Query params**: `status`, `skip`, `limit`
**Response 200**: `{ "data": [...], "count": N }`

#### PATCH /api/v1/matches/{match_id}
Update a match (including status change).

**Request**:
```json
{
  "status": "live",
  "home_score": 1,
  "away_score": 0
}
```

**Response 200**: Updated match
**Response 404**: `{ "detail": "Match not found" }`

#### DELETE /api/v1/matches/{match_id}
**Response 200**: `{ "message": "Match deleted" }`
**Response 404**: `{ "detail": "Match not found" }`

---

### Match Updates

#### POST /api/v1/matches/{match_id}/updates
Post a real-time update.

**Request**:
```json
{
  "content": "第10分钟，主队进球！1-0"
}
```

**Response 201**: MatchUpdate object
**Response 404**: `{ "detail": "Match not found" }`

#### DELETE /api/v1/matches/{match_id}/updates/{update_id}
**Response 200**: `{ "message": "Update deleted" }`
**Response 404**: `{ "detail": "Update not found" }`

---

### Match Media

#### POST /api/v1/matches/{match_id}/media/photos
Upload a photo.

**Request**: `multipart/form-data`
- `photo` (file, required): JPEG/PNG/WebP, max 10MB
- `caption` (string, optional)

**Response 201**: MatchMedia object (type: "photo")
**Response 404**: `{ "detail": "Match not found" }`
**Response 422**: Invalid file type or size exceeded

#### POST /api/v1/matches/{match_id}/media/videos
Add an external video link.

**Request**:
```json
{
  "url": "https://www.bilibili.com/video/BV1xx...",
  "title": "比赛精彩集锦",
  "caption": "第一场比赛"
}
```

**Response 201**: MatchMedia object (type: "video")
**Response 404**: `{ "detail": "Match not found" }`
**Response 422**: Invalid URL format

#### DELETE /api/v1/matches/{match_id}/media/{media_id}
**Response 200**: `{ "message": "Media deleted" }`
**Response 404**: `{ "detail": "Media not found" }`

---

### Team Content

#### GET /api/v1/team-content
Get current team content (admin, same as public).

**Response 200**: TeamContent object

#### PUT /api/v1/team-content
Update team introduction content.

**Request**:
```json
{
  "content": "<h2>球队历史</h2><p>观湖实验学校足球队成立于...</p>"
}
```

**Response 200**: Updated TeamContent object
**Response 422**: Empty content

---

## Error Response Format

All error responses follow the existing project convention:

```json
{
  "detail": "Human-readable error message in English"
}
```

## Authentication

- All admin endpoints (`/api/v1/coaches`, `/api/v1/players`, `/api/v1/matches`, `/api/v1/team-content PUT`) require `CurrentUser` dependency with `is_superuser` check.
- All public endpoints (`/api/v1/public/*`) require no authentication.
- Existing `deps.py` `CurrentUser` and `get_current_active_superuser` patterns are reused.

# Data Layer Contract

**Feature**: 001-landing-page  
**Date**: 2026-04-19

This contract defines the async data-fetching functions that the landing page Server Components consume. The implementation starts with JSON fixtures and will be swapped to EdgeOne KV without changing the function signatures.

## Functions

### `getUpcomingMatches(limit?: number): Promise<Match[]>`

Returns upcoming matches sorted by date ascending (nearest first).

- **Default limit**: 3
- **Filter**: `status === 'upcoming'`
- **Sort**: `dateTime` ascending
- **Returns**: Array of `Match` objects, may be empty

### `getRecentResults(limit?: number): Promise<Match[]>`

Returns recently completed matches sorted by date descending (most recent first).

- **Default limit**: 3
- **Filter**: `status === 'completed'`
- **Sort**: `dateTime` descending
- **Returns**: Array of `Match` objects, may be empty

### `getLiveMatches(): Promise<Match[]>`

Returns currently live matches.

- **Filter**: `status === 'live'`
- **Sort**: `dateTime` ascending
- **Returns**: Array of `Match` objects, may be empty

### `getTeamProfile(): Promise<TeamProfile>`

Returns the team's public profile.

- **Returns**: Single `TeamProfile` object
- **Invariant**: Always returns a valid profile (fallback defaults if data is missing)

## Module Location

```
src/lib/data/matches.ts   → getUpcomingMatches, getRecentResults, getLiveMatches
src/lib/data/team.ts      → getTeamProfile
```

## Implementation Phases

| Phase | Implementation | Module Change |
|-------|---------------|---------------|
| 1 (Current) | Read from `data/fixtures/*.json` | Function bodies read JSON |
| 2 (Future) | Read from EdgeOne KV | Function bodies call KV API |

Components never import from `data/fixtures/` directly — they only call functions from `src/lib/data/`.

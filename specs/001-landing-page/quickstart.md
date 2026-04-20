# Quickstart: Landing Page

**Feature**: 001-landing-page  
**Branch**: `001-landing-page`

## Prerequisites

- Node.js LTS (≥ 18)
- pnpm (or npm/yarn)

## Setup

```bash
# Clone and checkout
git checkout 001-landing-page

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — this is the landing page (root route `/`).

## Project Structure

```
src/app/page.tsx              ← Landing page (entry point)
src/app/layout.tsx            ← Root layout (fonts, nav, footer)
src/components/landing/       ← Landing page section components
src/components/layout/        ← Header, footer, mobile nav
src/components/ui/            ← Reusable UI (match card, status badge, shadcn/ui)
src/lib/data/                 ← Data layer (reads fixtures, swappable to KV)
src/lib/types/                ← TypeScript type definitions
src/lib/constants/locale.ts   ← All Chinese UI text strings
data/fixtures/                ← Mock match and team data (JSON)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Landing page Server Component with ISR (60s) |
| `src/lib/data/matches.ts` | `getUpcomingMatches()`, `getRecentResults()`, `getLiveMatches()` |
| `src/lib/data/team.ts` | `getTeamProfile()` |
| `data/fixtures/matches.json` | Mock match data |
| `data/fixtures/team.json` | Mock team profile |
| `src/lib/constants/locale.ts` | Centralized Chinese text strings |

## Testing

```bash
pnpm test                # Run all tests
pnpm test -- --watch     # Watch mode
```

Tests use Vitest + React Testing Library. All data is from JSON fixtures — no network or external services needed.

## Design Tokens

Colors, typography, and spacing are defined in:
- `src/app/globals.css` — CSS custom properties (shadcn/ui variables)
- `tailwind.config.ts` — Tailwind theme extension
- `DESIGN.md` — Authoritative design system reference

**Never hard-code colors in components.** Use semantic classes: `bg-primary`, `text-muted-foreground`, `border-border`, etc.

## Data Layer

The landing page reads data via functions in `src/lib/data/`. These currently read from `data/fixtures/*.json`. To swap to EdgeOne KV later, only the function implementations change — component code stays the same.

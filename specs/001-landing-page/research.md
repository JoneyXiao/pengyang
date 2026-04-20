# Research: Landing Page

**Feature**: 001-landing-page  
**Date**: 2026-04-19  
**Status**: Complete

## 1. Next.js ISR on EdgeOne Pages

### Decision
Use Next.js App Router route-segment-level `revalidate` export for ISR with 60-second revalidation.

### Rationale
- The App Router provides a simple `export const revalidate = 60` at the page level — no `fetch()` wrapper needed when reading from local fixtures or a data layer function.
- ISR uses the stale-while-revalidate pattern: serves the cached page instantly, regenerates in the background after the interval expires.
- Constitution mandates ISR/static for the homepage (Principle IV). This is the simplest compliant approach.
- EdgeOne Pages deployment compatibility: ISR requires the Node.js runtime (not Edge Runtime) for the page route since it relies on server-side regeneration. The `page.tsx` will use the default Node.js runtime. API routes can still use Edge Runtime.

### Alternatives Considered
- **SSR on every request**: Higher latency, unnecessary since match data changes infrequently. Rejected.
- **Full static (`output: 'export'`)**: Cannot revalidate without redeploy. Too stale for match data. Rejected.
- **On-demand revalidation via `revalidatePath`**: Could be added later when the admin panel triggers match updates. Not needed for the initial mock-data phase.

### Pattern

```typescript
// src/app/page.tsx
export const revalidate = 60

export default async function HomePage() {
  const upcomingMatches = await getUpcomingMatches()
  const recentResults = await getRecentResults()
  const teamProfile = await getTeamProfile()
  // render sections...
}
```

## 2. Font Setup — Noto Sans SC via next/font

### Decision
Use `next/font/google` with Noto Sans SC as a CSS variable (`--font-noto-sans-sc`), subset to `chinese-simplified,latin`. Declare a system mono stack as a second CSS variable (`--font-mono`).

### Rationale
- `next/font` provides automatic self-hosting, zero CLS, and optimal loading — per Next.js best practices.
- Noto Sans SC is the only font in the design system (DESIGN.md). All text uses it across four weights: 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).
- Using the `variable` option enables Tailwind CSS integration via `fontFamily` theme extension.
- System mono stack (`ui-monospace, SFMono-Regular, Menlo, monospace`) for scores — no Google Font needed.

### Alternatives Considered
- **Google Fonts `<link>` tag**: No CLS prevention, no self-hosting. Rejected per Next.js font best practice.
- **Variable font file (self-hosted)**: More control but more manual. `next/font/google` handles this automatically if the font supports variable weights. Noto Sans SC on Google Fonts supports variable weights.

### Pattern

```typescript
// src/app/layout.tsx
import { Noto_Sans_SC } from 'next/font/google'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={notoSansSC.variable}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
body {
  font-family: var(--font-noto-sans-sc), sans-serif;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

## 3. shadcn/ui Theme — CSS Custom Properties Mapping

### Decision
Map DESIGN.md color palette to shadcn/ui's CSS variable system in `globals.css`. Use HSL format for shadcn/ui compatibility.

### Rationale
- shadcn/ui expects CSS custom properties in HSL format (e.g., `--primary: 142 71% 45%`).
- The design system defines specific hex colors that map cleanly to shadcn/ui semantic variables.
- Constitution (Principle III) prohibits hard-coded colors — all must come from the Tailwind theme / CSS variables.

### Color Mapping

| Design Token | Hex | HSL | shadcn/ui Variable |
|---|---|---|---|
| Canvas | `#FAFAF8` | `60 20% 97%` | `--background` |
| Card Surface | `#FFFFFF` | `0 0% 100%` | `--card` |
| Primary Text | `#18181B` | `240 6% 10%` | `--foreground`, `--card-foreground` |
| Pitch Green | `#22C55E` | `142 71% 45%` | `--primary` |
| Inverse Text | `#FFFFFF` | `0 0% 100%` | `--primary-foreground` |
| Muted Surface | `#F4F4F5` | `240 5% 96%` | `--muted` |
| Secondary Text | `#52525B` | `240 4% 34%` | `--muted-foreground` |
| Sky Blue | `#38BDF8` | `198 93% 60%` | `--secondary` |
| Secondary fg | `#0C4A6E` | `201 79% 24%` | `--secondary-foreground` |
| Trophy Gold | `#F59E0B` | `38 92% 50%` | `--accent` |
| Gold fg | `#451A03` | `22 91% 14%` | `--accent-foreground` |
| Error | `#EF4444` | `0 84% 60%` | `--destructive` |
| Border | `#E4E4E7` | `240 5% 90%` | `--border` |
| Input border | `#E4E4E7` | `240 5% 90%` | `--input` |
| Focus ring | `#22C55E` at 50% | `142 71% 45%` | `--ring` |

### Pattern

```css
/* globals.css :root */
:root {
  --background: 60 20% 97%;
  --foreground: 240 6% 10%;
  --card: 0 0% 100%;
  --card-foreground: 240 6% 10%;
  --primary: 142 71% 45%;
  --primary-foreground: 0 0% 100%;
  --secondary: 198 93% 60%;
  --secondary-foreground: 201 79% 24%;
  --accent: 38 92% 50%;
  --accent-foreground: 22 91% 14%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 34%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 5% 90%;
  --input: 240 5% 90%;
  --ring: 142 71% 45%;
  --radius: 0.75rem;
}
```

## 4. Mock Data Layer — Swappable Data Source Pattern

### Decision
Create a data access layer in `src/lib/data/` with async functions that read from JSON fixture files. The functions return typed data. When EdgeOne KV is integrated later, only the internal implementation of these functions changes — components remain untouched.

### Rationale
- Spec (FR-019) mandates mock-first development with fixtures.
- Constitution (Principle II) requires tests with no external dependencies — JSON fixtures enable this.
- The data layer acts as a repository boundary: components depend on the function interface, not the storage implementation.

### Alternatives Considered
- **Direct imports of JSON in components**: No abstraction boundary, harder to swap to KV later. Rejected.
- **API routes returning JSON**: Unnecessary indirection for a Server Component that can directly call async functions. Rejected.

### Pattern

```typescript
// src/lib/data/matches.ts
import type { Match } from '@/lib/types'
import fixtureData from '@/data/fixtures/matches.json'

export async function getUpcomingMatches(limit = 3): Promise<Match[]> {
  // In production, this will read from EdgeOne KV
  const matches = fixtureData as Match[]
  return matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, limit)
}

export async function getRecentResults(limit = 3): Promise<Match[]> {
  const matches = fixtureData as Match[]
  return matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, limit)
}
```

## 5. Image Strategy — Next.js Image with Blur Placeholder

### Decision
Use `next/image` `<Image>` component for all photography. Hero image uses `priority={true}` and `sizes="100vw"`. Grid images use responsive `sizes`. Blur placeholders via static imports (for local assets) or `placeholder="blur"` with `blurDataURL` for remote images.

### Rationale
- Constitution (Principle IV) mandates `next/image` for all images — no raw `<img>`.
- DESIGN.md specifies `placeholder="blur"` and blurhash for all photography.
- Hero image is the LCP element — must use `priority` for preloading.
- For the mock-data phase, placeholder images can be local static assets with auto-generated blur data URLs.

### Pattern

```tsx
// Hero — LCP element
<Image
  src={heroImage}
  alt="鹏飏足球比赛精彩瞬间"
  fill
  priority
  sizes="100vw"
  className="object-cover"
  placeholder="blur"
/>

// Grid card images
<Image
  src={matchPhoto}
  alt={match.description}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={match.blurDataURL}
/>
```

### Fallback Strategy
When hero photography is not available, render a solid Pitch Green (`#22C55E`) background with the team name and tagline — per spec edge case. Implemented via a conditional check on the image URL.

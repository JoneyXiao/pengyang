# Design System — Pengyang Football (鹏飏足球)

## 1. Visual Theme & Atmosphere

Pengyang Football is a primary school team site that needs to feel like recess — bright grass, blue sky, kids running. The canvas is warm white with just enough cream to avoid clinical sterility, and every surface radiates the energy of a Saturday morning match on a school field. The mood is **"playground meets trophy case"**: celebratory enough to make a kid proud of their team photo, organized enough that a parent trusts the match schedule, and sporty enough that a visiting coach takes it seriously.

The dominant visual metaphor is **the pitch under open sky** — grass green and sky blue anchor the palette, accented by warm gold for achievements and highlights. Cards are rounded and slightly elevated with soft shadows, like trading cards pinned to a corkboard. Photography is the hero: action shots of kids playing, team portraits, muddy boots, high-fives. The typography is bold and rounded — sturdy enough for headlines, friendly enough that nothing feels corporate.

There is **no dark mode** on the public site. The light, airy canvas is the product — it signals openness, community, and daytime energy. The admin panel may use a neutral surface but never inverts to full dark.

**Key Characteristics:**
- Warm white canvas (`#FAFAF8`) — creamy, not sterile, feels like sunlit paper
- Grass Green (`#22C55E`) as the primary brand accent — the pitch, the team, the energy
- Sky Blue (`#38BDF8`) as the secondary accent — the open-air feeling of outdoor sport
- Trophy Gold (`#F59E0B`) for highlights, achievements, and featured match moments
- Rounded everything: 12/16/20px radii — friendly, never sharp, never fully pill-shaped
- Photography-forward: action shots, team portraits, and match moments drive the visual energy
- Soft depth via subtle shadows — no flat 1px borders, no harsh elevation; think "card on a table"
- Bold, rounded sans-serif headlines that feel athletic but approachable
- Chinese (Simplified) as the primary language; all type choices must render CJK beautifully

## 2. Color Palette & Roles

### Primary (Brand)
- **Pitch Green** (`#22C55E` / Tailwind `green-500`): The signature accent. Used for primary buttons, active navigation indicators, success states, and key interactive elements. This is the color of the football pitch — the visual anchor of the entire brand.
- **Pitch Green Dark** (`#16A34A` / `green-600`): Hover state for primary buttons, active link color, darker emphasis when green appears on green-tinted surfaces.
- **Pitch Green Light** (`#DCFCE7` / `green-100`): Soft background tint for highlighted sections, success banners, and feature cards that need to stand out from the white canvas without using a full green fill.

### Secondary (Accent)
- **Sky Blue** (`#38BDF8` / `sky-400`): The complementary accent for secondary actions, informational badges, live-match status indicators, and the "outdoor" feeling. Used sparingly — green leads, blue supports.
- **Sky Blue Light** (`#E0F2FE` / `sky-100`): Background tint for informational panels, match-day countdown cards, and secondary highlighted sections.
- **Trophy Gold** (`#F59E0B` / `amber-500`): Achievement highlights, featured match badges, star ratings, and "pinned" content markers. The celebratory accent — used for moments of pride.
- **Trophy Gold Light** (`#FEF3C7` / `amber-100`): Background for achievement cards and featured content sections.

### Surface & Background
- **Canvas** (`#FAFAF8`): The default page background. Warm white with a hint of cream — like sunlit paper on a school desk.
- **Card Surface** (`#FFFFFF`): Pure white for card backgrounds, creating subtle lift against the warm canvas.
- **Muted Surface** (`#F4F4F5` / `zinc-100`): Secondary background for sidebar, admin panels, and alternating table rows.
- **Border Default** (`#E4E4E7` / `zinc-200`): Standard card borders and dividers — visible but quiet.
- **Border Emphasis** (`#D4D4D8` / `zinc-300`): Stronger borders for form inputs and focused containers.

### Text & Neutrals
- **Primary Text** (`#18181B` / `zinc-900`): Headlines, body copy, and all primary content. Near-black for maximum readability on light surfaces.
- **Secondary Text** (`#52525B` / `zinc-600`): Bylines, timestamps, metadata, helper text. Dark enough to read, light enough to recede.
- **Muted Text** (`#A1A1AA` / `zinc-400`): Placeholders, disabled states, tertiary information.
- **Inverse Text** (`#FFFFFF`): Text on green, blue, or dark buttons.

### Semantic
- **Success** (`#22C55E` / `green-500`): Reuses the brand green — win notifications, form success, upload complete.
- **Warning** (`#F59E0B` / `amber-500`): Reuses trophy gold — schedule conflicts, incomplete forms.
- **Error** (`#EF4444` / `red-500`): Form validation errors, failed uploads, system errors. The only red in the system — used strictly for errors, never decoration.
- **Info** (`#38BDF8` / `sky-400`): Reuses sky blue — informational banners, help tooltips.
- **Focus Ring** (`#22C55E` at 50% opacity): Visible keyboard focus indicator on all interactive elements.

### Gradient System
**No decorative gradients.** Color is applied in solid blocks. The only gradient-like treatment is the hero section where a match photo may have a subtle bottom-edge overlay (`rgba(0,0,0,0.3)` → `transparent`) to ensure headline legibility over photography. This is a functional gradient, not a decorative one.

## 3. Typography Rules

### Font Family
- **Noto Sans SC** (Google Fonts) — weight 400 / 500 / 700 / 900. The primary typeface for everything: headlines, body, UI labels, and all Chinese content. Noto Sans SC is designed for Chinese–Latin mixed typesetting, renders beautifully at every size, and is free. It has a warm, rounded personality that avoids the coldness of geometric sans-serifs.
- **System Mono** (`ui-monospace, SFMono-Regular, Menlo, monospace`) — used only for match scores, timestamps in the live-update feed, and admin data fields. Never for body or UI labels.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Hero Display | Noto Sans SC | 48px / 3rem | 900 (Black) | 1.15 | -0.5px | Homepage hero headline. The biggest type on the site. |
| Page Title | Noto Sans SC | 36px / 2.25rem | 700 (Bold) | 1.20 | -0.3px | Page-level titles (e.g., "球队介绍", "赛程") |
| Section Title | Noto Sans SC | 28px / 1.75rem | 700 | 1.25 | -0.2px | Section headers within a page |
| Card Title | Noto Sans SC | 20px / 1.25rem | 700 | 1.30 | 0 | Match cards, player cards, coach cards |
| Subtitle | Noto Sans SC | 18px / 1.125rem | 500 (Medium) | 1.40 | 0 | Sub-headings, card descriptions |
| Body | Noto Sans SC | 16px / 1rem | 400 (Regular) | 1.60 | 0 | Default reading text, descriptions, paragraphs |
| Body Small | Noto Sans SC | 14px / 0.875rem | 400 | 1.50 | 0 | Secondary descriptions, helper text |
| Label | Noto Sans SC | 14px / 0.875rem | 500 | 1.30 | 0.2px | Form labels, navigation items, button text |
| Caption | Noto Sans SC | 12px / 0.75rem | 400 | 1.40 | 0.1px | Timestamps, photo credits, metadata |
| Score Display | System Mono | 32px / 2rem | 700 | 1.00 | 0 | Match scores in live updates and results |
| Timestamp Mono | System Mono | 12px / 0.75rem | 500 | 1.30 | 0.5px | Live-match timeline timestamps |

### Principles
- **Noto Sans SC does everything.** One family, four weights, all sizes. This avoids font-loading overhead and ensures CJK characters always match Latin characters.
- **No font below 12px.** Chinese characters become unreadable below this threshold. The smallest text in the system is 12px for captions and timestamps.
- **Weight carries hierarchy, not font switching.** Black (900) for heroes, Bold (700) for titles, Medium (500) for labels, Regular (400) for body. No light or thin weights — they don't work for CJK at body sizes.
- **Tight leading on headlines, relaxed on body.** Display and title sizes use 1.15–1.30 line-height; body text uses 1.50–1.60 for comfortable reading of Chinese paragraphs.
- **Letter-spacing is negative on large sizes only.** Headlines at 28px+ get slight negative tracking (-0.2 to -0.5px) to tighten the display feel. Body and label sizes stay at 0 or slightly positive.
- **Mono is reserved for data.** Match scores (`3 : 1`), live-update timestamps (`14:32`), and admin data fields. Never for UI text, headlines, or navigation.

### Font Loading
- Load Noto Sans SC via Google Fonts with `display=swap` and subset to `chinese-simplified,latin`.
- Preload the 400 and 700 weights (the most-used). Load 500 and 900 on demand.
- Total font payload target: < 200 KB for initial load (Noto Sans SC is variable-weight capable — use the variable font file if available to reduce weight).

## 4. Component Stylings

### Buttons

**Primary — Pitch Green**
- Background: `#22C55E` (Pitch Green)
- Text: `#FFFFFF` (white), Noto Sans SC 14px / 500
- Border: none
- Border radius: `12px`
- Padding: `10px 20px` (default), `8px 16px` (small), `12px 24px` (large)
- Hover: background darkens to `#16A34A` (Pitch Green Dark)
- Active: background `#15803D` (green-700), slight scale `0.98`
- Focus: `0 0 0 3px rgba(34, 197, 94, 0.4)` ring
- Disabled: opacity `0.5`, cursor `not-allowed`
- Transition: 150ms ease on background and transform

**Secondary — Outlined**
- Background: transparent
- Text: `#18181B` (Primary Text), Noto Sans SC 14px / 500
- Border: `1px solid #E4E4E7` (Border Default)
- Border radius: `12px`
- Padding: same as primary
- Hover: background `#F4F4F5` (Muted Surface), border `#D4D4D8`
- Focus: same green ring as primary
- Transition: 150ms ease

**Ghost — Text Only**
- Background: transparent
- Text: `#52525B` (Secondary Text), Noto Sans SC 14px / 500
- Border: none
- Hover: background `#F4F4F5`
- Used for: tertiary actions, "查看更多" links, icon buttons

**Destructive — Error Red**
- Background: `#EF4444` (Error)
- Text: white
- Hover: `#DC2626` (red-600)
- Used only for: delete actions in admin panel. Never on public pages.

### Cards

**Match Card (Primary)**
- Background: `#FFFFFF`
- Border: `1px solid #E4E4E7`
- Border radius: `16px`
- Padding: `20px`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)`
- Hover: shadow lifts to `0 4px 12px rgba(0, 0, 0, 0.08)`, translateY `-2px`
- Transition: 200ms ease on shadow and transform
- Contains: team badges, score (mono), match time, status badge

**Player/Coach Card**
- Same base as match card
- Contains: circular avatar photo (clipped `border-radius: 50%`), name, role/position, brief bio
- Avatar: 80px diameter on desktop, 64px on mobile, with a `2px solid #22C55E` ring

**Photo Gallery Card**
- Background: `#FFFFFF`
- Border radius: `12px`
- Overflow: hidden (image fills top, caption fills bottom)
- Image: aspect-ratio `4:3`, object-fit `cover`
- Caption area: `12px` padding, Noto Sans SC 12px / 400, `#52525B`
- Hover: image scales to `1.03` inside the overflow container
- Transition: 300ms ease on transform

**Feature Card (Highlighted)**
- Same as match card but with a `2px solid #22C55E` left border or a Pitch Green Light (`#DCFCE7`) background tint
- Used for: pinned announcements, upcoming featured matches, top stories

### Badges & Tags

**Status Badge**
- Font: Noto Sans SC 12px / 500
- Padding: `4px 10px`
- Border radius: `8px`
- Variants:
  - **Live**: background `#FEE2E2` (red-100), text `#DC2626` (red-600), with a pulsing red dot animation
  - **Upcoming**: background `#E0F2FE` (sky-100), text `#0284C7` (sky-600)
  - **Completed**: background `#DCFCE7` (green-100), text `#16A34A` (green-600)
  - **Cancelled**: background `#F4F4F5` (zinc-100), text `#71717A` (zinc-500)

**Position Tag (Player)**
- Font: Noto Sans SC 12px / 500
- Padding: `2px 8px`
- Border radius: `6px`
- Background: `#F4F4F5`
- Text: `#52525B`

### Inputs & Forms

- Background: `#FFFFFF`
- Border: `1px solid #E4E4E7`
- Border radius: `12px`
- Padding: `10px 14px`
- Font: Noto Sans SC 16px / 400 (avoids iOS auto-zoom)
- Placeholder: `#A1A1AA` (Muted Text)
- Focus: border `#22C55E`, ring `0 0 0 3px rgba(34, 197, 94, 0.15)`
- Error: border `#EF4444`, ring `0 0 0 3px rgba(239, 68, 68, 0.15)`
- Disabled: background `#F4F4F5`, opacity 0.6
- Transition: 150ms ease on border-color and box-shadow

### Navigation

**Top Navigation Bar**
- Background: `#FFFFFF` with `backdrop-filter: blur(8px)` and 95% opacity when scrolled (sticky)
- Height: `64px` desktop, `56px` mobile
- Border: `1px solid #E4E4E7` bottom edge
- Logo: Pengyang team badge + "鹏飏足球" wordmark in Noto Sans SC 20px / 700, `#18181B`
- Nav links: Noto Sans SC 14px / 500, `#52525B`, hover `#22C55E`
- Active link: text `#22C55E`, with a `2px solid #22C55E` bottom indicator (inset)
- CTA button: "赛事管理" (admin) — small primary green button, visible only to authenticated users
- Mobile: logo left, hamburger right. Hamburger opens a slide-in sheet from the right with stacked nav links at 16px / 500 with 48px row height for touch targets

**Footer**
- Background: `#18181B` (zinc-900) — the only dark surface in the public site
- Text: `#A1A1AA` (zinc-400) for secondary, `#FFFFFF` for headings
- Links: `#A1A1AA`, hover `#22C55E`
- Padding: `48px` vertical
- Contains: school name, team badge, quick links, contact info, copyright

### Image Treatment

- **Aspect ratios**: 16:9 for hero and match banners, 4:3 for gallery thumbnails, 3:4 for player portraits, 1:1 for avatars
- **Corners**: always rounded to match the parent card — `12px` for gallery images, `16px` for feature images, `50%` for avatars
- **Shadow**: subtle `0 1px 3px rgba(0,0,0,0.06)` on standalone images
- **Overlay**: hero images get a bottom-edge gradient overlay for text legibility (`linear-gradient(transparent 50%, rgba(0,0,0,0.5))`)
- **Loading**: use Next.js `<Image>` with `placeholder="blur"` and a low-res blurhash for all photography
- **Hover**: gallery images scale to `1.03` inside their overflow-hidden container; no border changes

### Media Embeds (Video)

- Container: responsive `aspect-ratio: 16/9` wrapper
- Border radius: `12px` with overflow hidden
- Border: `1px solid #E4E4E7`
- Iframe: fills the container 100%
- Title attribute: always set for accessibility (e.g., `title="2026年春季联赛第三轮精彩回放"`)
- Loading: `loading="lazy"` on all video iframes below the fold

## 5. Layout Principles

### Spacing System
- **Base unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- **Section padding**: `64px` vertical on desktop, `40px` on mobile — between major page sections
- **Card padding**: `20px` interior (desktop), `16px` (mobile)
- **Card gap**: `16px` between cards in a grid, `12px` on mobile
- **Inline spacing**: labels sit `8px` above inputs; headlines sit `12px` above body text; metadata sits `8px` below content
- **Page edge padding**: `16px` mobile, `24px` tablet, `32px` desktop (inside the max-width container)

### Grid & Container
- **Max content width**: `1200px` (centered, `mx-auto`)
- **Column patterns**:
  - Homepage hero: full-width image with overlaid text
  - Match list: 1-column on mobile, 2-column grid on tablet, 3-column on desktop
  - Player grid: 2-column mobile, 3-column tablet, 4-column desktop
  - Photo gallery: masonry-style or 2/3/4-column CSS grid
  - Article/detail pages: single column, max `720px` reading width, centered
- **Gutters**: `16px` on mobile, `24px` on desktop

### Whitespace Philosophy
The site is for a children's football team — it should feel **spacious and breathable**, like a playing field. Generous whitespace between sections prevents the page from feeling like a cramped notice board. Let the photography and the green accents carry the energy; the whitespace carries the organization. Every major section is separated by at least `64px` of vertical breathing room on desktop. Cards have comfortable internal padding and external margins. Nothing should feel squeezed.

### Border Radius Scale
- **6px** — small badges, tags, tiny UI elements
- **8px** — status badges, compact buttons
- **12px** — standard buttons, form inputs, gallery image cards, small cards
- **16px** — primary content cards (match cards, player cards), feature images
- **20px** — hero sections, large feature cards, modal dialogs
- **50%** — avatars, team badge circles

Six radius values, consistently applied. The system is rounded but not pill-shaped — `12px` and `16px` do most of the work. Nothing is square-cornered; nothing is fully circular except avatars.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow | Page canvas, inline text, flat sections |
| 1 | `0 1px 2px rgba(0,0,0,0.04)` | Subtle card resting state, nav bar bottom edge |
| 2 | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Default card shadow — the workhorse elevation |
| 3 | `0 4px 12px rgba(0,0,0,0.08)` | Card hover state, dropdown menus, tooltips |
| 4 | `0 8px 24px rgba(0,0,0,0.12)` | Modal dialogs, image lightbox overlay |
| 5 | `0 16px 48px rgba(0,0,0,0.16)` | Full-screen overlays (admin photo upload modal) |

The depth philosophy is **gentle lift**. Cards rest at Level 2 and rise to Level 3 on hover — a small but noticeable change that invites interaction without being dramatic. Modals at Level 4–5 create a clear layering hierarchy. There are no `inset` shadows and no colored shadows — depth is always neutral and soft.

### Decorative Depth
- **Bottom border on sticky nav**: `1px solid #E4E4E7` — the only border-based depth treatment
- **Green ring on player avatars**: `2px solid #22C55E` — decorative, not depth, but creates visual grouping
- **No gradients for depth** — shadows alone handle elevation

## 7. Do's and Don'ts

### Do
- **Do** use `#FAFAF8` (warm white) as the canvas for every public page. The warmth is deliberate.
- **Do** use Pitch Green (`#22C55E`) as the primary interactive color — buttons, links, active states, focus rings.
- **Do** use photography as the primary visual content. Action shots of kids playing football are more compelling than any illustration.
- **Do** round everything: `12px` for inputs and buttons, `16px` for cards, `20px` for hero sections.
- **Do** use Noto Sans SC for all text. Let weight (400/500/700/900) create hierarchy.
- **Do** use soft shadows (Level 2) on cards to create gentle depth. Cards should feel like they're resting on the page, not flat or harsh.
- **Do** use Sky Blue (`#38BDF8`) for informational and secondary accents — match-day indicators, info badges.
- **Do** use Trophy Gold (`#F59E0B`) for achievements and featured content — but sparingly, as a celebratory highlight.
- **Do** ensure all text meets 4.5:1 contrast ratio. Test Chinese characters specifically — they have more visual complexity than Latin and need good contrast.
- **Do** keep the admin panel visually consistent with the public site — same green accent, same card style, same type system.
- **Do** use semantic color tokens from shadcn/ui (`bg-primary`, `text-muted-foreground`) — never raw Tailwind color classes in components.

### Don't
- **Don't** use a dark background for public pages. The light canvas is the identity.
- **Don't** use red for anything except errors. Red is not a decorative color in this system — it means "something is wrong."
- **Don't** use gradients for decoration. Solid colors only. The one exception is the functional hero image overlay.
- **Don't** use more than 3 accent colors on a single page (green + blue + gold is the maximum).
- **Don't** use thin font weights (300 or lighter) for Chinese text — CJK strokes become unreadable.
- **Don't** use sharp square corners on any card or interactive element. The minimum radius is `6px`.
- **Don't** use heavy box shadows or colored glows. Depth is subtle and neutral.
- **Don't** use emoji as icons. Use Lucide icons (the shadcn/ui default) for all iconography.
- **Don't** hard-code colors in component files. All colors come from the Tailwind theme / CSS variables.
- **Don't** use placeholder-only form labels. Every input needs a visible `<label>`.
- **Don't** use animation for decoration. Motion is reserved for meaningful state transitions: card hover lift, page transitions, live-match status pulse.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single column, stacked cards, hamburger nav, hero text over image, 16px edge padding |
| Tablet | 640–1023px | 2-column card grid, nav links visible, hero image wider, 24px edge padding |
| Desktop | ≥ 1024px | 3–4 column grids, full navigation bar, max-width container kicks in, 32px edge padding |
| Wide | ≥ 1280px | Content container maxes at 1200px, margins expand proportionally |

### Touch Targets
- All buttons: minimum `44px` height (10px vertical padding + 16px text + border)
- Nav links on mobile: `48px` row height in the mobile menu
- Card click targets: the entire card is tappable, not just the headline
- Form inputs: `44px` minimum height

### Collapsing Strategy
- **Nav**: full horizontal links on desktop → hamburger + slide-in sheet on mobile (< 1024px)
- **Grid**: 4-col → 3-col → 2-col → 1-col. Match cards and player cards reflow naturally.
- **Hero**: desktop shows image with overlaid text; mobile stacks image above text
- **Spacing**: section padding tightens from `64px` → `40px`. Card padding from `20px` → `16px`.
- **Type**: Hero display scales from `48px` → `32px`. Page title from `36px` → `28px`. Body stays at `16px`.
- **Photography**: responsive via Next.js `<Image>` with `sizes` attribute. Aspect ratios are preserved; no art-direction swaps.

### Image Behavior
- Next.js `<Image>` with `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` for grid images
- Hero images: `sizes="100vw"`, `priority={true}`, eager loading
- Gallery images: `loading="lazy"`, blurhash placeholder
- All images maintain their declared aspect ratio at every viewport width

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA / Accent**: Pitch Green `#22C55E`
- **Background (Canvas)**: Warm White `#FAFAF8`
- **Card Background**: Pure White `#FFFFFF`
- **Secondary Accent**: Sky Blue `#38BDF8`
- **Highlight / Achievement**: Trophy Gold `#F59E0B`
- **Primary Text**: `#18181B`
- **Secondary Text**: `#52525B`
- **Border**: `#E4E4E7`
- **Error**: `#EF4444`
- **Footer Background**: `#18181B`

### Example Component Prompts
1. *"Create a match card on a `#FAFAF8` canvas: a `#FFFFFF` card with `16px` radius, `1px solid #E4E4E7` border, Level 2 shadow. Inside: two team names in Noto Sans SC 16px / 700 flanking a score in system mono 32px / 700. Below: match date in 12px / 400 `#52525B`, and a status badge (green 'Completed' or sky-blue 'Upcoming'). Hover lifts to Level 3 shadow with `-2px` translateY, 200ms ease."*

2. *"Build a player profile card: `#FFFFFF` background, `16px` radius, Level 2 shadow. Top: circular 80px avatar with `2px solid #22C55E` ring. Below: player name in 20px / 700 `#18181B`, position tag in 12px / 500 on `#F4F4F5` background with `6px` radius, and a one-line bio in 14px / 400 `#52525B`. Card padding `20px`."*

3. *"Design the homepage hero: full-width match action photo with `aspect-ratio: 16/9`, bottom-edge gradient overlay (`transparent` to `rgba(0,0,0,0.5)`). Overlaid text: team name '鹏飏足球' in Noto Sans SC 48px / 900 white with `-0.5px` letter-spacing, and a tagline '友谊第一，比赛第二' in 18px / 500 white below. A green primary button '查看赛程' with `12px` radius sits below the tagline."*

4. *"Create a live-match update feed: vertical stack of entries, each with a system-mono 12px timestamp on the left (`#A1A1AA`), a green dot indicator, and an event description in Noto Sans SC 14px / 400 `#18181B` on the right. The most recent entry has a pulsing green dot. Entries are separated by `1px solid #E4E4E7` horizontal rules. Container has `16px` radius, `#FFFFFF` background, Level 2 shadow."*

5. *"Build the admin match-creation form: shadcn/ui FieldGroup layout with `12px` radius inputs on `#FFFFFF` backgrounds. Fields: match date (DatePicker), team A / team B (text inputs), match venue (text input), precautions (Textarea). A row of two buttons at the bottom: secondary outlined '取消' and primary green '创建比赛'. All inputs `44px` minimum height. Green focus rings on all fields."*

### Iteration Guide
When refining existing screens generated with this design system:
1. **Audit the canvas.** If any public page has a dark or pure-white `#FFFFFF` background as the main canvas, change it to `#FAFAF8`. The warmth matters.
2. **Audit corners.** Every card should be `16px`, every button/input `12px`, every badge `6–8px`. No square corners, no pill shapes (except avatars at `50%`).
3. **Audit shadows.** Cards should have Level 2 shadow at rest. If you see `border` without shadow on a card, add the shadow. If you see colored shadows or heavy `box-shadow`, replace with the neutral Level 2/3 values.
4. **Audit type.** All text should be Noto Sans SC. Check that Chinese text renders at ≥12px. Check that headlines use weight 700 or 900, body uses 400, labels use 500.
5. **Audit color usage.** Green is the primary accent. Blue is secondary. Gold is celebratory. Red is errors only. If you see any other accent color (purple, orange, teal, etc.), replace it with one of the four.
6. **Audit touch targets.** Every button, link, and interactive element must be ≥44px tall on mobile. Check the mobile nav drawer especially.
7. **Audit photography.** Match photos and team portraits should be prominent. If a page feels text-heavy with no imagery, add photography. Use `<Image>` with `placeholder="blur"` everywhere.

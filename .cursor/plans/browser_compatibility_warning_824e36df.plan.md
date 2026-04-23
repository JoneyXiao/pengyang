---
name: Browser Compatibility Warning
overview: Add browser compatibility detection and user-facing warnings in `frontend/index.html` so that users on outdated browsers see a clear upgrade message instead of a blank or broken page.
todos:
  - id: add-warning-html
    content: Add the hidden `#browser-warning` overlay div with inline styles and bilingual upgrade message to `frontend/index.html` (inside `<body>`, before `#root`)
    status: completed
  - id: add-nomodule-script
    content: Add `<script nomodule>` block that unhides the warning div for browsers that cannot run ES modules
    status: completed
  - id: add-feature-detect
    content: Add inline `<script type="module">` with CSS nesting / modern feature detection that unhides the warning div for partially-modern but insufficient browsers
    status: completed
isProject: false
---

# Browser Compatibility Warning for Outdated Browsers

## Context

This project uses a modern stack that requires recent browser versions:

- **Vite 7** with `<script type="module">` entry point (ES modules required)
- **React 19** (modern JS APIs)
- **Tailwind CSS v4** (uses `@layer`, CSS nesting, `oklch()` colors)
- **ES2020 TypeScript target** (optional chaining, nullish coalescing, etc.)

Currently, if a user visits with an outdated browser, they see a **blank white page** with no explanation — the `<script type="module">` is silently ignored by legacy browsers.

## Approach

Add two layers of detection directly in [frontend/index.html](frontend/index.html), requiring **zero extra dependencies** and **zero impact on modern browsers**:

### Layer 1: `<script nomodule>` fallback (catches very old browsers)

Browsers that do not support `<script type="module">` (e.g., IE 11, old Edge, old Android WebView) will ignore the app entry point entirely. The `nomodule` attribute causes a script to run **only** in these legacy browsers — modern browsers skip it completely.

This script will:
- Unhide a styled warning `<div>` already present in the HTML
- The warning message tells the user their browser is not supported and suggests upgrading

### Layer 2: Inline feature detection (catches "partially modern" browsers)

Some browsers support ES modules but lack newer features this project depends on (e.g., CSS nesting, `structuredClone`, `globalThis`). A small inline `<script type="module">` will run a quick feature check **before** the app loads:

```javascript
// Detect CSS nesting support (required by Tailwind v4)
try {
  if (!CSS.supports("selector(&)")) throw 0;
} catch {
  document.getElementById("browser-warning").style.display = "flex";
}
```

If the check fails, the same warning `<div>` is shown.

### Warning UI

A full-viewport overlay `<div id="browser-warning">` with inline styles (no Tailwind dependency), hidden by default (`display: none`). Content:

- A heading: "请更新您的浏览器" / "Please Update Your Browser" (bilingual, matching the `zh-CN` lang)
- A brief explanation that the browser version is too old
- Links to download Chrome, Firefox, Edge, Safari

The `#root` div remains in the DOM so the app can still attempt to load if the user dismisses or ignores the warning — but for `nomodule` browsers, the app simply won't start.

## Files Changed

Only **one file** needs modification:

- [frontend/index.html](frontend/index.html) — add the warning `<div>`, the `<script nomodule>` block, and the inline feature-detection `<script type="module">` block

No changes to the React app, build config, or dependencies.

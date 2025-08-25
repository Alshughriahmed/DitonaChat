# DitonaChat — Seed Pack (UI/Chat Essentials)

This seed contains just the UI brain of the chat to understand the layout and behavior quickly (no heavy deps).

## Files
- `src/app/chat/page.tsx`: main chat page (upper stage, lower interaction zone ~50%).
- `src/components/chat/Toolbar.tsx`: smart bottom toolbar (fixed, resizes, horizontal scroll on narrow view). Updates `--tb-h`.
- `src/components/chat/ChatComposer.tsx`: transparent composer; updates `--composer-h` and `--kb-pad`.
- `src/components/chat/ChatMessages.tsx`: transparent message dock (latest 2–3 vs. history scroll). Long-press to copy.
- `src/components/chat/LowerRightQuick.tsx`: switch-cam & beauty buttons at lower section’s top-right (outside toolbar).
- `src/app/globals.css`: variables and base rules (layers, transparency, no-scrollbar, bottom padding).
- `postcss.config.js`, `tailwind.config.js`: Tailwind v4 using `@tailwindcss/postcss` and correct content paths.

## Layers & CSS Vars
Layers: Stage (z-0) · Messages Dock (z-10) · Composer (z-20) · Toolbar (z-30)

Key vars:
- `--tb-h`: toolbar height (measured via ResizeObserver in Toolbar)
- `--composer-h`: composer height when open
- `--kb-pad`: extra pad for virtual keyboard
- `--safe-b`: env(safe-area-inset-bottom)

Layout padding formula:
`padding-bottom: calc(var(--tb-h) + var(--composer-h) + var(--kb-pad) + var(--safe-b));`

## Messages
- **latest**: show last 2–3 bubbles as translucent toasts.
- **history**: swipe/gesture up to open scrollable history (scrollbars visually hidden).
- Long-press to copy (`data-copied="1"` visual hint).

## Toolbar
Fixed bottom, measures itself, adapts on resize/orientation/keyboard, allows horizontal scrolling if icons overflow.

## Quick Buttons (top-right of lower section)
`LowerRightQuick` places **Switch Cam** and **Beauty** out of the toolbar. Wire handlers via props.

## Run
`pnpm i && pnpm dev -p 3001` (or `npm i && npm run dev`) then open `/chat`.

Fingerprints:
- `data-toolbar-version="smart-v5"`
- `data-composer-version="v1"`
- `data-messages-version="dock-v1"`
- `data-lrq="v1"`

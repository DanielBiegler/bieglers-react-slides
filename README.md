# react-slides

Portable, local presentations authored in TSX.

Write slides as React components, navigate with arrow keys, and present from a self-contained folder that runs in any browser — no server required.

## Features

- Three layouts: Cover, Centered, Split
- Native HTML content styled by CSS custom properties
- Speaker view with notes, timer, and next-slide preview — synced via BroadcastChannel
- Keyboard navigation (arrow keys + space)
- Offline-capable via PWA service worker

## Packages

- **`@danielbiegler/react-slides`** — the framework
- **`demo-slides`** — demo deck (not published)

## Development

```bash
bun install
cd packages/demo-slides && bun run dev
```

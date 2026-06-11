# Bieglers React Slides

Beautiful, portable, local presentations authored in TSX.

Write slides as React components, navigate with arrow keys, and present from a self-contained folder that runs in any browser — no server required.

Purposefully Code-First and emphasis on Type-Safety, so that you can iterate with your AI-Agent and build/edit the slide deck on the fly.

## Demo

- https://danielbiegler.github.io/bieglers-react-slides/

## Features

- Nine layouts: Cover, CoverCentered, CoverSplit, Centered, Split, Showcase, Video, Cards, List
- Native HTML content styled by CSS custom properties
- Progressive reveal via Steps (Cards, Centered, List, Code)
- Light and dark theme with system preference detection
- Slide transitions: fade and slide
- Speaker view with notes, timer, and next-slide preview — synced via BroadcastChannel
- Keyboard navigation (arrow keys, space, F for fullscreen)
- Offline-capable via PWA service worker

## Packages

- **`@danielbiegler/react-slides`** — the framework
- **`demo-slides`** — demo deck (not published)

## Development

```bash
bun install
cd packages/demo-slides && bun run dev
```

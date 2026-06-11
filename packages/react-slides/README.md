# @danielbiegler/react-slides

Framework for building beautiful, portable, local presentations in TSX.

## Install

```bash
npm install @danielbiegler/react-slides
```

Peer dependencies: `react`, `react-dom`, `react-router`

## Usage

```tsx
import "@danielbiegler/react-slides/style.css"
import { Deck, Slide, Code, Notes, Image, Video, List, Footnote } from "@danielbiegler/react-slides"

export default (
  <Deck title="My Deck" author="Name" date="2026" theme="auto" transition="slide">
    <Slide.Cover title="Hello" subtitle="A subtitle" />

    <Slide.Centered>
      <h2>A slide</h2>
      <p>Native HTML, styled by CSS custom properties.</p>
      <Notes>Only visible in Speaker View.</Notes>
    </Slide.Centered>

    <Slide.Split
      left={<Image src={photo} alt="A photo" />}
      right={<><h2>Split</h2><p>Media pane is edge-to-edge.</p></>}
      mediaPane="left"
    />
  </Deck>
)
```

## Layouts

| Component | Description |
|---|---|
| `Slide.Cover` | Title slide with icon, title, and subtitle |
| `Slide.CoverCentered` | Centered variant of Cover |
| `Slide.CoverSplit` | Cover with a split panel |
| `Slide.Centered` | Single centered content column |
| `Slide.Split` | Two-pane layout with optional full-bleed media pane |
| `Slide.Showcase` | Full-bleed image with optional title/description overlay |
| `Slide.Video` | Full-bleed video with optional title/description overlay |
| `Slide.Cards` | Grid of cards, optionally revealed one by one |
| `Slide.List` | Vertical list with titles, optionally revealed one by one |

## Helpers

| Component | Description |
|---|---|
| `Image` | Inline image with `fit` control |
| `Video` | Inline video; autoplays muted by default |
| `Code` | Syntax-highlighted code block with optional stepped highlights |
| `Notes` | Speaker notes — visible only in Speaker View |
| `Footnote` | Small footer note hoisted to the bottom of the slide |

## Vite plugin

`preloadPresentationAssets` injects `<link rel="preload">` tags for fonts, images, and videos at build time so assets are fetched before they're needed.

```ts
// vite.config.ts
import { preloadPresentationAssets } from "@danielbiegler/react-slides/vite-plugin"

export default defineConfig({
  plugins: [react(), preloadPresentationAssets()],
})
```

## Features

- Progressive reveal via Steps (`Slide.Cards`, `Slide.Centered`, `Slide.List`, `Code`)
- Light / dark theme with system preference detection (`theme="auto"`)
- Slide transitions: `fade`, `slide`, `none`
- Speaker View at `/#/speaker` — notes, timer, next-slide preview, synced via BroadcastChannel
- Keyboard navigation: arrow keys, space, `F` for fullscreen

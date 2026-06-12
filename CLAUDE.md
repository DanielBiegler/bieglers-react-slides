# react-slides

Bun monorepo. Two packages: `packages/react-slides` (the framework) and `packages/demo-slides` (demo deck).

## Commands

```bash
# Run the demo with hot reload
cd packages/demo-slides && bun run dev

# Type-check the demo (also traverses framework source)
cd packages/demo-slides && bunx tsc --noEmit

# Type-check the framework
cd packages/react-slides && bunx tsc --noEmit

# Install all workspace dependencies
bun install
```

## Conventions

- **Runtime**: Bun. No npm or yarn.
- **`Slide.*` namespace is for layouts only** — `Slide.Cards`, `Slide.Cover`, `Slide.CoverCentered`, `Slide.CoverSplit`, `Slide.Centered`, `Slide.Split`, `Slide.Showcase`, `Slide.Video`. Never add content components here.
- **Content is native HTML** — `<h1>`, `<blockquote>`, `<ul>`, `<img>` etc., styled by CSS custom properties. No content component abstraction.
- **No Tailwind** — styling is CSS Modules + CSS custom properties. Tokens live in `packages/react-slides/src/styles/tokens.css`.
- **No server-side logic** — client-side routing only via React Router + HashRouter.
- Helper components (`Code`, `Notes`, `Image`, `Video`, `Footnote`) are flat named exports, not under the `Slide` namespace.

## Gotchas

- **Font cascade**: each layout's `.root` must declare `font-family: var(--rs-font-sans)`. CSS custom properties don't re-evaluate on already-inherited computed values, so overriding `--rs-font-sans` on a wrapper won't apply unless the root re-reads it.
- **Library externals**: new runtime dependencies must be added to `rollupOptions.external` in `packages/react-slides/vite.config.ts`, or they get bundled into the published framework.

## Workflow

- **Update the changelog when done with a feature** — after completing any feature or notable fix, add an entry to `CHANGELOG.md` before considering the task done.

## Domain language

See [`CONTEXT.md`](./CONTEXT.md) for the canonical glossary. Use its terms — if something conflicts with it, update the glossary first.

## Architecture decisions

See [`docs/adr/`](./docs/adr/) for decisions on tech stack, routing, styling, PWA scope, and speaker view sync.

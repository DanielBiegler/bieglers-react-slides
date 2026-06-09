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
- **`Slide.*` namespace is for layouts only** — `Slide.Cover`, `Slide.Centered`, `Slide.Split`. Never add content components here.
- **Content is native HTML** — `<h1>`, `<blockquote>`, `<ul>`, `<img>` etc., styled by CSS custom properties. No content component abstraction.
- **No Tailwind** — styling is CSS Modules + CSS custom properties. Tokens live in `packages/react-slides/src/styles/tokens.css`.
- **No server-side logic** — client-side routing only via React Router + HashRouter.
- Helper components (`Code`, `Notes`, `Image`) are flat named exports, not under the `Slide` namespace.

## Domain language

See [`CONTEXT.md`](./CONTEXT.md) for the canonical glossary. Use its terms — if something conflicts with it, update the glossary first.

## Architecture decisions

See [`docs/adr/`](./docs/adr/) for decisions on tech stack, routing, styling, PWA scope, and speaker view sync.

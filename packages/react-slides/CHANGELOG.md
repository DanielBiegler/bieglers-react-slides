# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-13

### Added
- **`overrides` prop on all layouts and `<Deck>`**: pass a typed `Overrides` object to set CSS tokens directly using their `--rs-*` names (e.g. `"--rs-font-sans"`, `"--rs-accent"`) without wrapper divs. Deck-level overrides apply to all slides; per-layout overrides win via the CSS cascade.
- **`--rs-font-heading` token**: new CSS custom property (defaults to `var(--rs-font-sans)`) used by all heading elements (h1–h6) across every layout. Lets you set a display typeface for headings while keeping a different body font.
- **`Overrides` type exported** from `@danielbiegler/react-slides` for TypeScript consumers who want to type override objects explicitly.
- **`Slide.CoverSplit` — full-bleed image panel**: new `image` prop accepts an imported asset or URL and renders a full-bleed photo as the left panel background.
- **`Slide.CoverSplit` — accent color tint**: new `imageFilter` prop overlays the accent color via `mix-blend-mode: color`. Pass `true` for a full tint, a number (0–1) for a custom opacity, or omit it (default `false`) for no overlay.
- **`Slide.CoverSplit` — multi-icon support**: the `icon` prop now supports multiple icons side-by-side. Direct `<svg>` children are sized individually (`8rem`) rather than being stretched to fill a fixed container.
- **`Slide.CoverSplit` — `iconDirection` prop**: controls the flex direction of the icon area (`"row"` | `"column"`, default `"row"`).
- **`Deck` JSDoc**: added component-level and per-prop documentation that surfaces in editor tooltips for consumers of the published package.

## [0.1.0] - 2026-06-11

Initial release

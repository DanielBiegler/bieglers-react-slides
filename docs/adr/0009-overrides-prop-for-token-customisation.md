# `overrides` prop for per-slide and deck-level token customisation

## Context

The only way to change a CSS custom property on an individual slide was to wrap the layout in a `<div style={...}>`:

```tsx
<div style={{ width: "100%", height: "100%", "--rs-font-sans": "var(--rs-font-bricolage-grotesque)" }}>
  <Slide.Centered>...</Slide.Centered>
</div>
```

This was necessary because each layout component is its own outermost element — there is no ancestor to set the token on. The `theme` prop on `<Deck>` only toggles dark/light mode and offers no typography or spacing control. Deck-wide font changes required editing `tokens.css` directly.

## Decision

Add an `Overrides` type — exported from the package — as a typed record covering typography and key design tokens (tier B). Keys are the CSS custom property names directly, so the object can be spread onto a React `style` prop without any mapping layer:

```ts
type SansFonts =
  | "var(--rs-font-inter)"
  | "var(--rs-font-plus-jakarta)"
  | "var(--rs-font-bricolage-grotesque)"
  | "var(--rs-font-unbounded)"

type SerifFonts =
  | "var(--rs-font-fraunces)"
  | "var(--rs-font-newsreader)"
  | "var(--rs-font-playfair)"

export interface Overrides {
  // Typography
  "--rs-font-sans"?: SansFonts | (string & {})
  "--rs-font-serif"?: SerifFonts | (string & {})
  "--rs-font-mono"?: string
  "--rs-font-heading"?: SansFonts | SerifFonts | (string & {})  // falls back to --rs-font-sans
  "--rs-font-size-h1"?: string
  "--rs-font-size-h3"?: string
  "--rs-font-size-base"?: string
  "--rs-font-size-small"?: string
  "--rs-font-weight-heading"?: string
  "--rs-font-weight-body"?: string
  // Design
  "--rs-accent"?: string
  "--rs-bg"?: string
  "--rs-color"?: string
  "--rs-color-muted"?: string
  "--rs-slide-padding"?: string
  "--rs-gap"?: string
  "--rs-radius"?: string
}
```

Font keys use a `SansFonts | SerifFonts | (string & {})` union to surface the named stacks as editor autocomplete suggestions while still accepting any string. The `(string & {})` trick prevents TypeScript from collapsing the union to plain `string`. `--rs-font-mono` has no named token so it takes a plain `string`. `--rs-font-heading` includes both sans and serif stacks because display headings are often set in a serif. When a new named font stack is added to `tokens.css`, add its `"var(--rs-font-*)"` literal to the appropriate helper type here.

Add `overrides?: Overrides` to `<Deck>` and every layout component. Applied as an inline `style` (`overrides as React.CSSProperties`) on the root element — the CSS cascade handles precedence naturally: a layout-level override lives on a descendant and wins over the deck-level one without any JS merge logic.

Using CSS variable names as keys directly avoids a camelCase→token translation step. It also keeps the API honest: authors already know these names from writing CSS overrides, so no extra mapping to learn. A `toStyle` helper that translated camelCase aliases was considered and implemented initially but removed — it required a `TOKEN_MAP` that had to be kept in sync manually, and silent failures when a key was forgotten outweighed the minor JSX ergonomics gain.

Introduce `--rs-font-heading` as a new token. It is intentionally **not** defined in `tokens.css`: all heading elements use `font-family: var(--rs-font-heading, var(--rs-font-sans))` as a fallback chain directly in CSS. This is required because CSS custom properties propagate their *computed* value through inheritance — if `--rs-font-heading: var(--rs-font-sans)` were declared at `:root`, descendants would inherit the already-resolved font name and a later `fontSans` override on a slide root would not affect headings. By keeping `--rs-font-heading` undefined at `:root`, the `var(--rs-font-sans)` fallback is evaluated lazily in the context of each heading element, so it always reflects the nearest ancestor's `--rs-font-sans` value.

## Alternatives considered

**Wrapper div (status quo)** — works but is verbose, requires explicit `width/height: 100%`, and leaks implementation knowledge to the deck author.

**React context / JS theming object** — would allow typed overrides without inline styles, but adds runtime complexity and a new context provider. The CSS cascade already solves specificity correctly; a JS layer would duplicate it.

**Expand the `theme` prop** — passing `theme="bricolage"` etc. would be simpler at the call site but requires the framework to enumerate every possible theme upfront. `Overrides` keeps the framework open-ended.

## Consequences

- Deck authors can customise fonts, colors, and spacing at deck or slide level with no wrapper divs.
- `--rs-font-heading` is a non-breaking addition (falls back to `--rs-font-sans`; existing decks unchanged).
- The `Overrides` type is public API — field additions are non-breaking, renames or removals are breaking changes.
- Syntax highlighting tokens, surface colors, and transition duration are intentionally excluded from `Overrides` for now (too granular or belong to the global theme).

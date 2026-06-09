# CSS custom properties for theming, no Tailwind

Layout components use CSS Modules for scoped styles. Theme tokens (colors, fonts, spacing) are CSS custom properties on `:root`, overridden per-deck via the `<Deck>` component. Tailwind was considered but rejected — it would impose a build-time dependency on every deck project consuming the Framework, and adds unnecessary complexity for a component library with a finite set of layouts.

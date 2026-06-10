# Slide transitions via manual dual-mount + CSS

Slide transitions (`none`, `fade`, `slide`) are implemented by briefly mounting both the outgoing and incoming slide and animating them with CSS classes, unmounting the outgoing one on `animationend`. The transition layer lives only in `SlideShell` around the `{slides[slideIndex]}` content; direction is derived from the change in `slideIndex` (delta sign), so keyboard, speaker-view `NAV`, and direct URL jumps all animate uniformly without threading a direction flag. Configured deck-level via a `transition` prop mirroring `theme`; honors `prefers-reduced-motion` by collapsing to an instant cut.

## Considered Options

- **View Transitions API** — native and zero-dependency, but an earlier attempt was reverted: Chrome's `plus-lighter` blend on `::view-transition-image-pair` caused a bright flash, and coordinating `flushSync` with React Router produced a cleanup race during rapid navigation. Cross-browser support is also uneven. Rejected.
- **Framer Motion (`AnimatePresence`)** — robustly handles dual-mount, exit animations, and interrupt cases, but adds a ~30–50kb dependency to a framework that deliberately prizes a tiny, portable bundle (see [ADR-0004](./0004-css-variables-no-tailwind.md)). Rejected.

## Consequences

- Mid-transition navigation interrupts immediately (the in-flight outgoing slide snaps and a fresh transition starts from the latest slide) rather than queuing or locking input.
- The Speaker View previews are intentionally not animated; the transition layer is confined to the audience-facing `SlideShell`.

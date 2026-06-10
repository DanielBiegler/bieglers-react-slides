# ADR 0007 — Steps: progressive reveal within a slide

## Status
Decided

## Context
Presenters need to reveal content incrementally within a single slide — e.g., showing a title first and then cards one by one, or stepping through different code highlight ranges — without changing slides. This is a standard presentation capability ("builds" in Keynote, "fragments" in Reveal.js).

## Decision

### Scope
Steps are intentionally limited to three use cases. No generic `<Step>` wrapper component.

| Component | How steps are declared | Sequence |
|---|---|---|
| `Slide.Cards` | `reveal` boolean prop | step 0 = title only; step N = card N appears |
| `Slide.Centered` | `reveal` boolean prop | step 0 = first child; step N = Nth+1 child fades in |
| `Code` | `highlight` accepts `string \| string[]` | each array entry is one step's highlight spec |

### URL persistence
The current step is stored as `?step=N` in the URL (HashRouter search param). Step navigation uses `replace` (not `push`) so the browser history stack stays proportional to slide count.

### Navigation
- **Forward (→)**: if `step < stepCount`, increment step (`replace`); otherwise advance to the next slide (`push`) — the step param is dropped.
- **Backward (←)**: if `step > 0`, decrement step (`replace`); if `step === 0`, navigate to the previous slide showing it fully revealed (step clamped to its `stepCount`).

### Reveal animation
Newly revealed elements fade in via `opacity: 0 → 1` CSS transition (~200 ms). Code highlight changes transition via `background` and `border-left-color` on the line element. Both honour `prefers-reduced-motion: reduce` (transition collapses to 1 ms so `transitionend` still fires).

### Speaker View
Step is included in the `SLIDE_STATE` BroadcastChannel message. `NAV` messages from the Speaker View are step-aware (they advance/decrement steps before switching slides). No new Speaker View UI is added.

### Architecture
- `StepsContext` (analogous to `FootnoteContext`) is provided by `SlideLayer` per slide.
- Step-capable components register their step count via `useLayoutEffect` when mounted.
- `SlideShell` owns the registered step count in a ref, reset during render on slide change.
- The active step is read from `useSearchParams()` in `SlideShell` and distributed via `DeckContext`.

## Alternatives considered
- **Generic `<Step>` wrapper**: rejected — requires a new concept, more API surface, and the user explicitly values simplicity.
- **Per-layout step arrays** (e.g. `reveal={[0, 1, 2]}`): rejected — the fixed sequence (title → card[0] → …) is predictable enough; explicit arrays add authoring friction for no clear benefit.
- **Push history for steps**: rejected — creates a history stack proportional to slides × steps; keyboard ← already handles step-backward.
- **Step counter in Speaker View UI**: rejected — the presenter authored the steps and knows they exist; a counter adds noise.

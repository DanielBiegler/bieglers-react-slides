# ADR 0008 — Speaker View: standalone navigation and connection indicator

## Status
Decided

## Context
The Speaker View has no navigation logic of its own — it sends `NAV` messages over BroadcastChannel and waits for `SLIDE_STATE` back from the slides tab. If no slides tab is open (e.g. when practising a talk alone), navigation is silently a no-op and the displayed slide never changes.

Two improvements are needed:
1. A visual indicator showing whether a slides tab is listening on the channel.
2. Independent navigation when no slides tab is present, including full step support.

## Decision

### Connection detection — PING/PONG
BroadcastChannel provides no way to enumerate other listeners. Two approaches were considered:

| Approach | Behaviour |
|---|---|
| **Heartbeat from Deck** | `Deck` emits a periodic message regardless of navigation. Runs even when no Speaker View is open. |
| **PING from Speaker View (chosen)** | Speaker View sends `{ type: "PING" }` on mount and every 2 s. `Deck` responds with the current `SLIDE_STATE`. No background traffic when Speaker View is closed. |

Speaker View considers itself **connected** if a `SLIDE_STATE` has arrived within the last 4 s (2× the ping interval, giving headroom for browser scheduling variance). Anything older or absent → **disconnected**.

### Connection indicator
A small dot is rendered to the left of the "Current — N / T" slide label. Gray = disconnected, green = connected. Placed there (not in the footer) because it contextualises the slide position — the presenter reads "connected + slide 3/12" as one unit.

### Standalone navigation
When disconnected, navigation is handled entirely inside `SpeakerView`:
- `goNext` / `goPrev` mirror the step-aware logic in `SlideShell`.
- `StepsContext` is wired into the current slide's `ScaledSlide` so step-capable components (`Slide.Cards`, `Slide.Centered`, `Code`) register their step count locally.
- A `stepCountsCache` (same pattern as `SlideShell`) enables backward navigation to land on the correct last step of a slide with steps.
- `stepCountRef` is reset synchronously during render on slide change, matching `SlideShell`'s approach.

### Reconnect behaviour
When a slides tab opens, it responds to the next `PING` with `SLIDE_STATE`, which immediately snaps the Speaker View to the slides tab's current position. The **slides tab has priority** — any standalone navigation progress is discarded. This is intentional: the slides tab is the audience-facing surface and is the canonical source of truth during a live talk.

## Alternatives considered
- **Heartbeat from Deck**: rejected — emits traffic even when the Speaker View is closed.
- **Ignore steps in standalone mode**: rejected — practising without feeling the step rhythm gives a false sense of timing and flow.
- **Speaker View syncing its position back to the slides tab on reconnect**: rejected — the slides tab may be at a deliberate starting position set by the presenter before opening the Speaker View.

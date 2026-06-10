# react-slides

A tool for creating portable, local presentations using React and TypeScript. Authored in TSX by developers.

## Language

**Deck**:
A single presentation — an ordered collection of Slides wrapped in a `<Deck>` component that carries deck-level metadata (title, theme, etc.), defined in a `.tsx` file.
_Avoid_: Presentation, slideshow, file

**Slide**:
One screen of content in a Deck. Authored as a JSX element using a Layout component.
_Avoid_: Page, frame, card

**Layout**:
A pre-built slide component that defines the visual structure of a Slide. Exposed under the `Slide` namespace (e.g. `Slide.Cover`, `Slide.Centered`, `Slide.Split`). Content inside layouts is authored as native HTML, styled by CSS custom properties.
_Avoid_: Template, component, slide type

**Transition**:
The visual animation played when moving between Slides in a Deck. A deck-level setting (`none`, `fade`, or `slide`) configured on `<Deck>`. Audience-facing only — never shown in the Speaker View.
_Avoid_: Animation, effect, motion

**Build**:
The compiled output of a Deck — a self-contained folder (HTML + bundled assets) that runs in a browser without a server. Each Slide is accessible via a URL route (e.g. `/2`, `/3`).
_Avoid_: Export, bundle, output

**Framework**:
The `@danielbiegler/react-slides` npm package at `packages/react-slides/` — exports `<Deck>` and all `Slide.*` layout components. No CLI; deck authors set up their own Vite project and import from the framework.
_Avoid_: Library, tool, app

**Demo**:
The private `demo-slides` package at `packages/demo-slides/` — a real deck built with the Framework, used to validate the authoring experience during development. Not published to npm.
_Avoid_: Example, test, playground

**Speaker View**:
A separate browser tab opened alongside the presentation that shows speaker notes, a timer, next-slide preview, and slide progress. Stays in sync with the presentation via the BroadcastChannel API.
_Avoid_: Presenter mode, second screen, backstage

**Notes**:
Speaker-facing text attached to a Slide, authored via the `<Notes>` helper component. Visible only in the Speaker View, never to the audience.
_Avoid_: Comments, annotations, description

**Starter Template**:
A future clone-and-edit GitHub repository that gives new users a minimal working deck project without requiring a CLI. References the published Framework package.
_Avoid_: Boilerplate, scaffold, CLI

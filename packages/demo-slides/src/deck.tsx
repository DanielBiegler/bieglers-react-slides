import { Code, Deck, Footnote, Notes, Slide } from "@danielbiegler/react-slides"

export default (
  <Deck title="react-slides demo" author="Daniel Biegler" date="2026" theme="auto" transition="slide">
    <Slide.Cover
      title="react-slides"
      subtitle="Portable presentations with React"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M9 10l2 2 4-4" />
        </svg>
      }
    />

    <Slide.CoverCentered
      title="react-slides"
      subtitle="Portable presentations with React"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M9 10l2 2 4-4" />
        </svg>
      }
    />

    <Slide.CoverSplit
      title="react-slides"
      subtitle="Portable presentations with React"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M9 10l2 2 4-4" />
        </svg>
      }
    />

    <div style={{ width: "100%", height: "100%", "--rs-font-sans": "var(--rs-font-plus-jakarta)" } as React.CSSProperties}>
      <Slide.Centered>
        <h2>Plus Jakarta Sans</h2>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <p style={{ color: "var(--rs-color-muted)", fontSize: "var(--rs-font-size-small)", fontFamily: "var(--rs-font-mono)" }}>
          --rs-font-sans: var(--rs-font-plus-jakarta)
        </p>
      </Slide.Centered>
    </div>

    <div style={{ width: "100%", height: "100%", "--rs-font-sans": "var(--rs-font-bricolage-grotesque)" } as React.CSSProperties}>
      <Slide.Centered>
        <h2>Bricolage Grotesque</h2>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <p style={{ color: "var(--rs-color-muted)", fontSize: "var(--rs-font-size-small)", fontFamily: "var(--rs-font-mono)" }}>
          --rs-font-sans: var(--rs-font-bricolage-grotesque)
        </p>
      </Slide.Centered>
    </div>

    <div style={{ width: "100%", height: "100%", "--rs-font-sans": "var(--rs-font-unbounded)" } as React.CSSProperties}>
      <Slide.Centered>
        <h2>Unbounded</h2>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <p style={{ color: "var(--rs-color-muted)", fontSize: "var(--rs-font-size-small)", fontFamily: "var(--rs-font-mono)" }}>
          --rs-font-sans: var(--rs-font-unbounded)
        </p>
      </Slide.Centered>
    </div>

    <Slide.Centered>
      <h2>Simple by default</h2>
      <p>Three layouts. Native HTML. CSS custom properties.</p>
      <Notes>Introduce the project — what problem it solves and who it's for.</Notes>
      <Footnote>Source: react-slides design notes, 2026</Footnote>
    </Slide.Centered>

    <Slide.Centered>
      <blockquote>
        The best tool is the one you actually use.
        <cite>— Someone, probably</cite>
      </blockquote>
      <Notes>Pause here. Let the quote land before moving on.</Notes>
    </Slide.Centered>

    <Slide.Centered>
      <h2>Authoring a slide</h2>
      <Code
        language="tsx"
        highlight="3,5"
        code={`
<Slide.Centered>
  <h2>Hello world</h2>
  <p>Just write HTML inside a layout.</p>
  <Code language="tsx" highlight="2-4" code={snippet} />
  <Notes>Only you can see this.</Notes>
</Slide.Centered>
        `}
      />
    </Slide.Centered>

    <Slide.Split
      left={
        <>
          <h2>Regular split</h2>
          <p>Both panes share the same padding. Good for text, lists, or small visuals.</p>
        </>
      }
      right={
        <>
          <h3>Right pane</h3>
          <ul>
            <li>Equal padding on both sides</li>
            <li>Content stays inset</li>
          </ul>
        </>
      }
    />

    <Slide.Split
      left={
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
          alt="Mountain landscape"
        />
      }
      right={
        <>
          <h2>Full-bleed image</h2>
          <p>The image fills its half edge-to-edge with <code>object-fit: cover</code>.</p>
        </>
      }
      mediaPane="left"
    />

    <Slide.Showcase
      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400"
      alt="Sunlit mountain range above the clouds"
      title="The image is the point"
      description="A full-bleed photo with an optional title and description over a gradient scrim."
    >
      <Footnote>
        Photo: Qingbao Meng /{" "}
        <a href="https://unsplash.com/photos/aerial-photography-of-mountain-ranges-jba6IjjuYP4" target="_blank" rel="noreferrer">
          Unsplash
        </a>
      </Footnote>
    </Slide.Showcase>

    <Slide.Centered>
      <h2>That&apos;s it.</h2>
      <p style={{ color: "var(--rs-color-muted)" }}>
        Open <code>/#/speaker</code> in a second tab for speaker view.
      </p>
    </Slide.Centered>
  </Deck>
)

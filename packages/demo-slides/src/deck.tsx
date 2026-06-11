import { Code, Deck, Footnote, Notes, Slide } from "@danielbiegler/react-slides"
import imgMountainSplit from "../assets/pietro-de-grandi-Q5dMq3cKqec-unsplash.jpg"
import imgMountainShowcase from "../assets/simon-twukN12EN7c-unsplash.jpg"

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
          src={imgMountainSplit}
          alt="Mountain landscape"
        />
      }
      right={
        <>
          <h2>Full-bleed image</h2>
          <p>The image fills its half edge-to-edge with <code>object-fit: cover</code>.</p>
          <Footnote>
            Photo: <a href="https://unsplash.com/de/@peter_mc_greats" target="_blank" rel="noreferrer">Pietro De Grandi</a>
            {" / "}
            <a href="https://unsplash.com/de/fotos/weisser-berg-in-der-nahe-eines-gewassers-Q5dMq3cKqec" target="_blank" rel="noreferrer">Unsplash</a>
          </Footnote>
        </>
      }
      mediaPane="left"
    />

    <Slide.Cards
      title="Three reasons to try react-slides"
      cards={[
        {
          title: "Zero lock-in",
          description: "Your deck is a TSX file. No proprietary format, no walled garden — version control it like code.",
        },
        {
          title: "Native HTML",
          description: "Write headings, lists, and blockquotes instead of drag-and-drop boxes.",
        },
        {
          title: "CSS tokens",
          description: "Override any design decision — colors, fonts, spacing — with a single custom property.",
        },
      ]}
    />

    <Slide.Cards
      title="Cards reveal one by one"
      reveal
      cards={[
        {
          title: "Step 1",
          description: "Press → and I appear first.",
        },
        {
          title: "Step 2",
          description: "Press → again and I follow.",
        },
        {
          title: "Step 3",
          description: "One more → and the slide is complete.",
        },
      ]}
    >
      <Notes>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum reprehenderit eligendi quasi libero incidunt iusto tempora magnam eos maiores qui minima vero accusantium, atque ea dolor facilis a, possimus magni?
        <ul>
          <li>foo</li>
          <li>bar</li>
          <li>baz</li>
        </ul>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Beatae, quidem nisi ex obcaecati vero recusandae accusamus amet alias labore ducimus quisquam maxime reprehenderit.
      </Notes>
    </Slide.Cards>

    <Slide.Centered reveal>
      <h2>A question worth sitting with</h2>
      <p style={{ color: "var(--rs-color-muted)" }}>
        Press → to reveal the follow-up.
      </p>
    </Slide.Centered>

    <Slide.Centered>
      <h2>Stepped code highlights</h2>
      <Code
        language="tsx"
        highlight={["2", "4", "2,4"]}
        code={`
<Slide.Centered>
  <h2>Hello world</h2>
  <p>Just write HTML inside a layout.</p>
  <Notes>Only you can see this.</Notes>
</Slide.Centered>
        `}
      />
    </Slide.Centered>

    <Slide.Cards
      title="Cards auto size too if you have more/less of them"
      cards={[
        {
          title: "Custom border",
          description: "Open /#/speaker in a second tab for notes and slide preview.",
          border: "left",
        },
        {
          title: "Custom accents",
          description: "Each card can carry its own accent color and border side.",
          accent: "#e06c75",
          border: "top",
        },
      ]}
    />

    <Slide.Cards
      title="Card content can be any ReactNode"
      cards={[
        {
          title: "Plain strings",
          description: "A string still renders as a styled paragraph — no change needed.",
        },
        {
          title: "Inline markup",
          description: (
            <p style={{ margin: 0, color: "var(--rs-color-muted)", lineHeight: 1.6 }}>
              Mix in <strong>bold text</strong>, <code>inline code</code>, or{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>links</a> wherever you need them.
            </p>
          ),
        },
        {
          title: "Custom structure",
          description: (
            <ul style={{ margin: 0, paddingLeft: "1.25em", color: "var(--rs-color-muted)", lineHeight: 1.8 }}>
              <li>Full control over content</li>
              <li>Use any HTML or components</li>
              <li>Styles inherit from the card</li>
            </ul>
          ),
        },
      ]}
    />

    <Slide.List
      title="Why react-slides?"
      description="A few reasons to give it a shot."
      items={[
        {
          title: "Zero lock-in",
          content: "Your deck is a TSX file. Version control it, diff it, review it like code.",
        },
        {
          title: "Native HTML",
          content: "Write real headings, lists, and blockquotes — no drag-and-drop abstractions.",
        },
        {
          title: "CSS custom properties",
          content: "Every token is overridable. Fonts, colors, spacing — one property changes everything.",
        },
        {
          title: "Portable",
          content: "Builds to a static site. Deploy anywhere: GitHub Pages, Vercel, S3.",
        },
      ]}
    />

    <Slide.List
      title="Compact list"
      description='sizing="fit" shrinks the list to the widest item.'
      sizing="fit"
      items={[
        { title: "Short", content: "Fits the content, not the slide." },
        { title: "A bit longer title", content: "All items match the widest one." },
        { title: "Medium length", content: "Easier to read on sparse slides." },
      ]}
    />

    <Slide.List
      title="List — right border & custom accents"
      border="right"
      items={[
        {
          align: "left",
          title: "Default accent",
          content: "Falls back to --rs-accent when no accent prop is given.",
        },
        {
          align: "center",
          title: "Per-item override",
          content: "Pass any CSS color to the accent prop on an individual item.",
          accent: "#e06c75",
        },
        {
          align: "right",
          title: "ReactNode content",
          accent: "#98c379",
          content: (
            <p style={{ margin: 0, color: "var(--rs-color-muted)", lineHeight: 1.6 }}>
              Content can be <strong>any ReactNode</strong> — rich markup, lists, or custom components.
            </p>
          ),
        },
      ]}
    />

    <Slide.Showcase
      src={imgMountainShowcase}
      alt="White mountain near a body of water"
      title="The image is the point"
      description="A full-bleed photo with an optional title and description over a gradient scrim."
    >
      <Footnote>
        Photo: <a href="https://unsplash.com/de/@simon_berger" target="_blank" rel="noreferrer">simon</a>
        {" / "}
        <a href="https://unsplash.com/de/fotos/landschaftsfotografie-von-bergen-twukN12EN7c" target="_blank" rel="noreferrer">Unsplash</a>
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

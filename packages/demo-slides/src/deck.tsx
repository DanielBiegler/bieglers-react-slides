import { Code, Deck, Image, Notes, Slide } from "@danielbiegler/react-slides"

export default (
  <Deck title="react-slides demo" theme="dark">
    <Slide.Cover
      title="react-slides"
      subtitle="Portable presentations with React"
      author="Daniel Biegler"
      date="2026"
    />

    <Slide.Centered>
      <h2>Simple by default</h2>
      <p>Three layouts. Native HTML. CSS custom properties.</p>
      <Notes>Introduce the project — what problem it solves and who it's for.</Notes>
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
        code={`
<Slide.Centered>
  <h2>Hello world</h2>
  <p>Just write HTML inside a layout.</p>
  <Notes>Only you can see this.</Notes>
</Slide.Centered>
        `}
      />
    </Slide.Centered>

    <Slide.Split
      left={
        <>
          <h2>Split layout</h2>
          <ul>
            <li>Text on the left</li>
            <li>Full-bleed image on the right</li>
            <li>50 / 50 by default</li>
          </ul>
        </>
      }
      right={
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
          alt="Technology"
        />
      }
      mediaPane="right"
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
          <p>Set <code>mediaPane="left"</code> or <code>"right"</code> to let an image fill its half edge-to-edge — no padding, no border radius.</p>
        </>
      }
      mediaPane="left"
    />

    <Slide.Centered>
      <h2>That&apos;s it.</h2>
      <p style={{ color: "var(--rs-color-muted)" }}>
        Open <code>/#/speaker</code> in a second tab for speaker view.
      </p>
    </Slide.Centered>
  </Deck>
)

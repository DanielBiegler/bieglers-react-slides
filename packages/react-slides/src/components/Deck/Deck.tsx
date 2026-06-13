import { Children, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import type { Overrides } from "../../overrides"
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"
import { DeckContext } from "../../context/DeckContext"
import { FootnoteContext } from "../../context/FootnoteContext"
import { StepsContext } from "../../context/StepsContext"
import "../../styles/tokens.css"
import styles from "./Deck.module.css"
import { SpeakerView } from "./SpeakerView"

type Transition = "none" | "fade" | "slide"

interface DeckProps {
  /** Shown in the footer and in the browser tab title. */
  title: string
  /** Shown in the footer alongside `date`, e.g. `"Jane Smith"`. */
  author?: string
  /** Shown in the footer alongside `author`, e.g. `"2026"` or `"Q3 2026"`. */
  date?: string
  /**
   * Color scheme. `"auto"` (default) follows the OS preference via
   * `prefers-color-scheme`. Pass `"dark"` or `"light"` to force a theme.
   */
  theme?: "auto" | "dark" | "light"
  /**
   * Slide transition animation. Defaults to `"none"`.
   * - `"fade"` — cross-fades between slides.
   * - `"slide"` — slides in from the direction of navigation.
   */
  transition?: Transition
  /** CSS token overrides applied to all slides in the deck. Per-slide `overrides` take precedence via the CSS cascade. */
  overrides?: Overrides
  /** One or more slide elements — any valid React element works as a slide. */
  children: ReactElement | ReactElement[]
}


export const BROADCAST_CHANNEL = "react-slides"

const FONT_LOADS = [
  '400 1em "Inter Variable"',
  '400 1em "Plus Jakarta Sans Variable"',
  '400 1em "Bricolage Grotesque Variable"',
  '400 1em "Unbounded Variable"',
  '400 1em "Fraunces Variable"',
  'italic 400 1em "Fraunces Variable"',
  '400 1em "Newsreader Variable"',
  'italic 400 1em "Newsreader Variable"',
  '400 1em "Playfair Display Variable"',
  'italic 400 1em "Playfair Display Variable"',
]

function useReadinessGate() {
  const [navigationReady, setNavigationReady] = useState(false)
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    const fallback = setTimeout(() => setNavigationReady(true), 3000)

    Promise.allSettled([
      ...FONT_LOADS.map((f) => document.fonts.load(f)),
      document.fonts.ready,
    ]).then(() => {
      clearTimeout(fallback)
      setNavigationReady(true)
      setAssetsLoaded(true)
    })

    return () => clearTimeout(fallback)
  }, [])

  return { navigationReady, assetsLoaded }
}

export type ChannelMessage =
  | { type: "SLIDE_STATE"; slideIndex: number; total: number; step: number; stepCount: number }
  | { type: "NAV"; direction: "next" | "prev" }
  | { type: "PING" }

/** Direction: +1 = forward (next), -1 = backward (prev). */
function enterClass(transition: Transition, direction: number): string {
  if (transition === "fade") return styles.fadeIn
  if (transition === "slide") return direction < 0 ? styles.slideInLeft : styles.slideInRight
  return ""
}

function exitClass(transition: Transition, direction: number): string {
  if (transition === "fade") return styles.fadeOut
  if (transition === "slide") return direction < 0 ? styles.slideOutRight : styles.slideOutLeft
  return ""
}

/** No-op passed to the outgoing SlideLayer so its step registrations don't clobber
 *  the incoming slide's count while the transition is playing. */
const NOOP_REGISTER = () => { }

/** Wraps one slide, providing StepsContext (for step registration) and
 *  FootnoteContext (for footnote hoisting). */
function SlideLayer({
  slide,
  className,
  onAnimationEnd,
  onStepsRegistered,
}: {
  slide: ReactElement
  className: string
  onAnimationEnd?: (e: React.AnimationEvent<HTMLDivElement>) => void
  onStepsRegistered: (count: number) => void
}) {
  const [footnote, setFootnote] = useState<ReactNode>(null)
  return (
    <StepsContext value={onStepsRegistered}>
      <FootnoteContext value={setFootnote}>
        <div className={className} onAnimationEnd={onAnimationEnd}>
          {slide}
          {footnote != null && <div className={styles.footnote}>{footnote}</div>}
        </div>
      </FootnoteContext>
    </StepsContext>
  )
}

function SlideShell({
  title,
  author,
  date,
  transition,
  slides,
  total,
  navigationReady,
}: {
  title: string
  author?: string
  date?: string
  transition: Transition
  slides: ReactElement[]
  total: number
  navigationReady: boolean
}) {
  const { index } = useParams<{ index: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const slideIndex = Math.max(0, Math.min(parseInt(index ?? "1", 10) - 1, total - 1))
  const step = Math.max(0, parseInt(searchParams.get("step") ?? "0", 10))
  const channel = useRef<BroadcastChannel | null>(null)

  const navigationReadyRef = useRef(navigationReady)
  navigationReadyRef.current = navigationReady

  // Step count for the current slide — registered by step-capable components (Cards,
  // Centered, Code) via StepsContext. Reset synchronously during render on slide change
  // so the new slide's useLayoutEffect registrations always land in a clean state.
  const stepCountRef = useRef(0)
  const prevSlideIndexForSteps = useRef(slideIndex)
  if (prevSlideIndexForSteps.current !== slideIndex) {
    prevSlideIndexForSteps.current = slideIndex
    stepCountRef.current = 0
  }

  // Cache each slide's step count as it renders so backward navigation can link
  // directly to the real last step rather than using a sentinel value.
  const stepCountsCache = useRef<Record<number, number>>({})

  const onStepsRegistered = useCallback((count: number) => {
    stepCountRef.current = count
    const idx = prevSlideIndexForSteps.current
    if (count > 0) stepCountsCache.current[idx] = count
    else delete stepCountsCache.current[idx]
  }, [])

  // Transition state — derived during render so the enter animation class is present
  // on the first painted frame. Direction comes from the index delta.
  const [prevIndex, setPrevIndex] = useState(slideIndex)
  const [anim, setAnim] = useState<{ outgoing: number; direction: number } | null>(null)
  if (prevIndex !== slideIndex) {
    if (transition !== "none") {
      setAnim({ outgoing: prevIndex, direction: Math.sign(slideIndex - prevIndex) })
    }
    setPrevIndex(slideIndex)
  }

  useEffect(() => {
    if (!anim) return
    const id = setTimeout(() => setAnim(null), 800)
    return () => clearTimeout(id)
  }, [anim])

  // Step-aware navigation helpers
  const goNext = useCallback(() => {
    if (!navigationReadyRef.current) return
    if (step < stepCountRef.current) {
      setSearchParams({ step: String(step + 1) }, { replace: true })
    } else if (slideIndex + 2 <= total) {
      navigate(`/${slideIndex + 2}`)
    }
  }, [step, slideIndex, total, navigate, setSearchParams])

  const goPrev = useCallback(() => {
    if (!navigationReadyRef.current) return
    // Clamp against registered count in case the URL step is somehow out of range.
    const effectiveStep = Math.min(step, stepCountRef.current)
    if (effectiveStep > 0) {
      if (effectiveStep === 1) setSearchParams({}, { replace: true })
      else setSearchParams({ step: String(effectiveStep - 1) }, { replace: true })
    } else if (slideIndex >= 1) {
      // Navigate to the previous slide. If it has steps (cached from when it last
      // rendered), land on its actual last step — no sentinel needed.
      const prevStepCount = stepCountsCache.current[slideIndex - 1] ?? 0
      if (prevStepCount > 0) navigate(`/${slideIndex}?step=${prevStepCount}`)
      else navigate(`/${slideIndex}`)
    }
  }, [step, slideIndex, navigate, setSearchParams])

  // Keep stable refs so the event handlers below never need to re-register
  const goNextRef = useRef(goNext)
  const goPrevRef = useRef(goPrev)
  goNextRef.current = goNext
  goPrevRef.current = goPrev

  // Always-current snapshot used when responding to PING from Speaker View
  const currentStateRef = useRef({ slideIndex, total, step })
  currentStateRef.current = { slideIndex, total, step }

  // BroadcastChannel — open once, reads latest nav callbacks via refs
  useEffect(() => {
    channel.current = new BroadcastChannel(BROADCAST_CHANNEL)
    channel.current.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type === "NAV") {
        if (e.data.direction === "next") goNextRef.current()
        if (e.data.direction === "prev") goPrevRef.current()
      } else if (e.data.type === "PING") {
        const { slideIndex, total, step } = currentStateRef.current
        channel.current?.postMessage({
          type: "SLIDE_STATE",
          slideIndex,
          total,
          step,
          stepCount: stepCountRef.current,
        } satisfies ChannelMessage)
      }
    }
    return () => channel.current?.close()
  }, [])

  // Broadcast slide state (includes step so Speaker View stays in sync)
  useEffect(() => {
    const msg: ChannelMessage = {
      type: "SLIDE_STATE",
      slideIndex,
      total,
      step,
      stepCount: stepCountRef.current,
    }
    channel.current?.postMessage(msg)
  }, [slideIndex, total, step])

  // Keyboard handler — registered once, reads latest callbacks via refs
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        goNextRef.current()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        goPrevRef.current()
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen()
        else document.exitFullscreen()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <DeckContext value={{ title, author, date, total, slideIndex, step }}>
      <div className={styles.slide}>
        <div className={styles.stage}>
          {anim && (
            <SlideLayer
              key={`out-${anim.outgoing}`}
              slide={slides[anim.outgoing]}
              className={`${styles.layer} ${exitClass(transition, anim.direction)}`}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setAnim(null)
              }}
              onStepsRegistered={NOOP_REGISTER}
            />
          )}
          <SlideLayer
            key={`in-${slideIndex}`}
            slide={slides[slideIndex]}
            className={`${styles.layer} ${anim ? enterClass(transition, anim.direction) : ""}`}
            onStepsRegistered={onStepsRegistered}
          />
        </div>
        <footer className={styles.footer}>
          <span>{author}</span>
          <span className={styles.footerCenter}>
            {[title, date].filter(Boolean).join(" · ")}
          </span>
          <span className={styles.footerRight}>{slideIndex + 1} / {total}</span>
        </footer>
      </div>
    </DeckContext>
  )
}

function DeckRouter({
  title,
  author,
  date,
  slides,
  theme,
  transition,
  overrides,
}: {
  title: string
  author?: string
  date?: string
  slides: ReactElement[]
  theme: "auto" | "dark" | "light"
  transition: Transition
  overrides?: Overrides
}) {
  const total = slides.length
  const { navigationReady, assetsLoaded } = useReadinessGate()

  return (
    <div className={styles.root} data-theme={theme === "auto" ? undefined : theme} style={overrides as React.CSSProperties}>
      {!assetsLoaded && (
        <div className={styles.loadingIndicator} title="Loading fonts and images…" />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/1" replace />} />
        <Route
          path="/:index"
          element={
            <SlideShell
              title={title}
              author={author}
              date={date}
              transition={transition}
              slides={slides}
              total={total}
              navigationReady={navigationReady}
            />
          }
        />
        <Route path="/speaker" element={<SpeakerView slides={slides} title={title} author={author} date={date} />} />
      </Routes>
    </div>
  )
}

/**
 * Root component for a presentation deck.
 *
 * Each direct child is treated as one slide. Wrap your slides in a single
 * `<Deck>` and export it as the default export from your deck file.
 *
 * ```tsx
 * export default (
 *   <Deck title="My Talk" author="Jane Smith" date="2026" theme="auto" transition="slide">
 *     <Slide.Cover title="Hello" subtitle="World" />
 *     <Slide.Centered><h2>Slide two</h2></Slide.Centered>
 *   </Deck>
 * )
 * ```
 *
 * Navigation:
 * - `→` / `↓` / `Space` — next slide or next step
 * - `←` / `↑` — previous slide or previous step
 * - `F` — toggle fullscreen
 * - Open `/#/speaker` in a second tab for speaker view (notes + timer + next-slide preview).
 */
export function Deck({ title, author, date, theme = "auto", transition = "none", overrides, children }: DeckProps) {
  const slides = Children.toArray(children) as ReactElement[]
  return (
    <HashRouter>
      <DeckRouter
        title={title}
        author={author}
        date={date}
        slides={slides}
        theme={theme}
        transition={transition}
        overrides={overrides}
      />
    </HashRouter>
  )
}

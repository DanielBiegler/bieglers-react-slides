import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { BROADCAST_CHANNEL, ChannelMessage } from "./Deck"
import { DeckContext } from "../../context/DeckContext"
import { NotesContext } from "../../context/NotesContext"
import { StepsContext } from "../../context/StepsContext"
import styles from "./SpeakerView.module.css"
import "../../styles/tokens.css"

const NOOP_SET_NOTES = () => {}

interface SpeakerViewProps {
  slides: ReactElement[]
  title: string
  author?: string
  date?: string
}

interface SlideState {
  slideIndex: number
  total: number
  step: number
  stepCount: number
}

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    function tick() {
      setElapsed(Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  function start() {
    startRef.current = Date.now() - elapsed * 1000
    setRunning(true)
  }
  function pause() { setRunning(false) }
  function reset() { setRunning(false); setElapsed(0); startRef.current = null }

  return { elapsed, running, start, pause, reset }
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

function ScaledSlide({
  slide,
  step,
  slideIndex,
  total,
  title,
  author,
  date,
  containerRef,
}: {
  slide: ReactElement
  step: number
  slideIndex: number
  total: number
  title: string
  author?: string
  date?: string
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [scale, setScale] = useState(1)
  const W = 1280
  const H = 720

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / W, height / H))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [containerRef])

  return (
    <DeckContext value={{ title, author, date, total, slideIndex, step }}>
      <div
        className={styles.slideScaled}
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        {slide}
      </div>
    </DeckContext>
  )
}

export function SpeakerView({ slides, title, author, date }: SpeakerViewProps) {
  const [state, setState] = useState<SlideState>({
    slideIndex: 0,
    total: slides.length,
    step: 0,
    stepCount: 0,
  })
  const [connected, setConnected] = useState(false)
  const [notesNode, setNotesNode] = useState<ReactNode>(null)
  const { elapsed, running, start, pause, reset } = useTimer()
  const currentRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const stepPreviewRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepCountRef = useRef(0)
  const stepCountsCache = useRef<Record<number, number>>({})

  // Reset stepCountRef synchronously when slideIndex changes (mirrors SlideShell's pattern)
  const prevSlideIndexForSteps = useRef(state.slideIndex)
  if (prevSlideIndexForSteps.current !== state.slideIndex) {
    prevSlideIndexForSteps.current = state.slideIndex
    stepCountRef.current = 0
  }

  useEffect(() => {
    const prev = document.title
    document.title = `${title} — Speaker`
    return () => { document.title = prev }
  }, [title])

  const onStepsRegistered = useCallback((count: number) => {
    const idx = prevSlideIndexForSteps.current
    stepCountRef.current = count
    if (count > 0) stepCountsCache.current[idx] = count
    else delete stepCountsCache.current[idx]
    setState(s => s.stepCount === count ? s : { ...s, stepCount: count })
  }, [])

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL)
    channelRef.current = channel
    channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type === "SLIDE_STATE") {
        setState(e.data)
        setConnected(true)
        if (disconnectTimerRef.current !== null) clearTimeout(disconnectTimerRef.current)
        disconnectTimerRef.current = setTimeout(() => setConnected(false), 4000)
      }
    }
    channel.postMessage({ type: "PING" } satisfies ChannelMessage)
    const pingId = setInterval(() => {
      channel.postMessage({ type: "PING" } satisfies ChannelMessage)
    }, 2000)
    return () => {
      channel.close()
      clearInterval(pingId)
      if (disconnectTimerRef.current !== null) clearTimeout(disconnectTimerRef.current)
    }
  }, [])

  function goNext() {
    setState(s => {
      if (s.step < stepCountRef.current) return { ...s, step: s.step + 1 }
      if (s.slideIndex + 1 < s.total) return { ...s, slideIndex: s.slideIndex + 1, step: 0, stepCount: 0 }
      return s
    })
  }

  function goPrev() {
    setState(s => {
      const effectiveStep = Math.min(s.step, stepCountRef.current)
      if (effectiveStep > 0) return { ...s, step: effectiveStep - 1 }
      if (s.slideIndex > 0) {
        const prevCount = stepCountsCache.current[s.slideIndex - 1] ?? 0
        return { ...s, slideIndex: s.slideIndex - 1, step: prevCount, stepCount: prevCount }
      }
      return s
    })
  }

  function nav(direction: "next" | "prev") {
    if (connected) {
      channelRef.current?.postMessage({ type: "NAV", direction } satisfies ChannelMessage)
    } else {
      direction === "next" ? goNext() : goPrev()
    }
  }

  function openSlides() {
    window.open(window.location.href.replace(/#.*$/, "") + `#/${state.slideIndex + 1}`)
  }

  const runningRef = useRef(running)
  const startRef = useRef(start)
  const pauseRef = useRef(pause)
  const resetRef = useRef(reset)
  const navRef = useRef(nav)
  const openSlidesRef = useRef(openSlides)
  runningRef.current = running
  startRef.current = start
  pauseRef.current = pause
  resetRef.current = reset
  navRef.current = nav
  openSlidesRef.current = openSlides

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLButtonElement) return
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        navRef.current("next")
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        navRef.current("prev")
      } else if (e.key === "q") {
        runningRef.current ? pauseRef.current() : startRef.current()
      } else if (e.key === "r") {
        resetRef.current()
      } else if (e.key === "o") {
        e.preventDefault()
        openSlidesRef.current()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const { slideIndex, total, step, stepCount } = state
  const current = slides[slideIndex]
  const next = slides[slideIndex + 1]
  const showStepPreview = stepCount > 0 && step < stepCount

  return (
    <div className={styles.root} data-theme="dark">
      <div className={styles.leftCol}>
        <div className={styles.slideCol}>
          <span className={styles.slideLabel}>
            <span
              className={styles.connectionDot}
              data-state={connected ? "connected" : "disconnected"}
            />
            Current — {slideIndex + 1} / {total}
            {stepCount > 0 && (
              <span className={styles.stepIndicator}>· Step {step} / {stepCount}</span>
            )}
            <button
              className={styles.btn}
              style={{ marginLeft: "auto" }}
              onClick={openSlides}
              title="Open slides (O)"
            >
              Open
            </button>
          </span>
          <div className={styles.slideFrame} ref={currentRef}>
            {current && (
              <NotesContext value={setNotesNode}>
                <StepsContext value={onStepsRegistered}>
                  <ScaledSlide
                    slide={current}
                    step={step}
                    slideIndex={slideIndex}
                    total={total}
                    title={title}
                    author={author}
                    date={date}
                    containerRef={currentRef}
                  />
                </StepsContext>
              </NotesContext>
            )}
            {showStepPreview && current && (
              <div className={styles.stepOverlay}>
                <span className={styles.stepOverlayLabel}>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className={styles.stepOverlayFrame} ref={stepPreviewRef}>
                  <NotesContext value={NOOP_SET_NOTES}>
                    <ScaledSlide
                      slide={current}
                      step={step + 1}
                      slideIndex={slideIndex}
                      total={total}
                      title={title}
                      author={author}
                      date={date}
                      containerRef={stepPreviewRef}
                    />
                  </NotesContext>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.slideCol}>
          <span className={styles.slideLabel}>Next</span>
          <div className={`${styles.slideFrame} ${styles.slideFrameDim}`} ref={nextRef}>
            {next
              ? <NotesContext value={NOOP_SET_NOTES}>
                  <ScaledSlide
                    slide={next}
                    step={0}
                    slideIndex={slideIndex + 1}
                    total={total}
                    title={title}
                    author={author}
                    date={date}
                    containerRef={nextRef}
                  />
                </NotesContext>
              : <span className={styles.emptyNext}>End of deck</span>
            }
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.timer}>
            <span
              className={styles.timerDot}
              data-state={running ? "running" : elapsed > 0 ? "paused" : "idle"}
            />
            {formatTime(elapsed)}
          </span>
          <div className={styles.controls}>
            <button className={styles.btn} onClick={() => nav("prev")} aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Prev
            </button>
            <button className={styles.btn} onClick={() => nav("next")} aria-label="Next">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className={styles.controls}>
            {running
              ? <button className={styles.btn} onClick={pause} title="Pauses the presentation timer (Q)">Pause</button>
              : <button className={styles.btn} onClick={start} title="Starts the presentation timer (Q)">Start</button>
            }
            <button className={styles.btn} onClick={reset} title="Resets the presentation timer (R)">Reset</button>
          </div>
        </div>
      </div>

      <div className={styles.notes}>
        <span className={styles.notesLabel}>Notes</span>
        <div className={styles.notesContent}>
          {notesNode ?? <span className={styles.notesEmpty}>No notes for this slide.</span>}
        </div>
      </div>
    </div>
  )
}

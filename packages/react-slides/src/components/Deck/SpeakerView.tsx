import { ReactElement, useEffect, useRef, useState } from "react"
import { BROADCAST_CHANNEL, ChannelMessage } from "./Deck"
import styles from "./SpeakerView.module.css"
import "../../styles/tokens.css"

interface SpeakerViewProps {
  slides: ReactElement[]
}

interface SlideState {
  slideIndex: number
  total: number
  notes: string
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
  containerRef,
}: {
  slide: ReactElement
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
    <div
      className={styles.slideScaled}
      style={{ width: W, height: H, transform: `scale(${scale})` }}
    >
      {slide}
    </div>
  )
}

export function SpeakerView({ slides }: SpeakerViewProps) {
  const [state, setState] = useState<SlideState>({
    slideIndex: 0,
    total: slides.length,
    notes: "",
  })
  const { elapsed, running, start, pause, reset } = useTimer()
  const currentRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL)
    channelRef.current = channel
    channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type === "SLIDE_STATE") setState(e.data)
    }
    return () => channel.close()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        channelRef.current?.postMessage({ type: "NAV", direction: "next" } satisfies ChannelMessage)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        channelRef.current?.postMessage({ type: "NAV", direction: "prev" } satisfies ChannelMessage)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function nav(direction: "next" | "prev") {
    channelRef.current?.postMessage({ type: "NAV", direction } satisfies ChannelMessage)
  }

  const { slideIndex, total, notes } = state
  const current = slides[slideIndex]
  const next = slides[slideIndex + 1]

  return (
    <div className={styles.root} data-theme="dark">
      <div className={styles.slides}>
        <div className={styles.slideCol}>
          <span className={styles.slideLabel}>Current — {slideIndex + 1} / {total}</span>
          <div className={styles.slideFrame} ref={currentRef}>
            {current && <ScaledSlide slide={current} containerRef={currentRef} />}
          </div>
        </div>

        <div className={styles.slideCol}>
          <span className={styles.slideLabel}>Next</span>
          <div className={`${styles.slideFrame} ${styles.slideFrameDim}`} ref={nextRef}>
            {next
              ? <ScaledSlide slide={next} containerRef={nextRef} />
              : <span className={styles.emptyNext}>End of deck</span>
            }
          </div>
        </div>
      </div>

      <div className={styles.notes}>
        <span className={styles.notesLabel}>Notes</span>
        <div className={styles.notesContent}>
          {notes
            ? notes
            : <span className={styles.notesEmpty}>No notes for this slide.</span>
          }
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.timer}>
          {formatTime(elapsed)}
        </span>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => nav("prev")}>← Prev</button>
          <button className={styles.btn} onClick={() => nav("next")}>Next →</button>
        </div>
        <div className={styles.controls}>
          {running
            ? <button className={styles.btn} onClick={pause}>Pause</button>
            : <button className={styles.btn} onClick={start}>Start</button>
          }
          <button className={styles.btn} onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  )
}

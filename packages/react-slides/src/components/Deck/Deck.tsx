import { Children, ReactElement, useCallback, useEffect, useRef, useState } from "react"
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router"
import { DeckContext } from "../../context/DeckContext"
import { NotesContext } from "../../context/NotesContext"
import "../../styles/tokens.css"
import styles from "./Deck.module.css"
import { SpeakerView } from "./SpeakerView"

type Transition = "none" | "fade" | "slide"

interface DeckProps {
  title: string
  author?: string
  date?: string
  theme?: "auto" | "dark" | "light"
  transition?: Transition
  children: ReactElement | ReactElement[]
}

export const BROADCAST_CHANNEL = "react-slides"

export type ChannelMessage =
  | { type: "SLIDE_STATE"; slideIndex: number; total: number; notes: string }
  | { type: "NAV"; direction: "next" | "prev" }

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

function SlideShell({
  title,
  author,
  date,
  transition,
  slides,
  total,
  notesRef,
}: {
  title: string
  author?: string
  date?: string
  transition: Transition
  slides: ReactElement[]
  total: number
  notesRef: React.RefObject<string>
}) {
  const { index } = useParams<{ index: string }>()
  const navigate = useNavigate()
  const slideIndex = Math.max(0, Math.min(parseInt(index ?? "1", 10) - 1, total - 1))
  const channel = useRef<BroadcastChannel | null>(null)

  // Transition state, derived during render so the enter animation is present
  // on the first painted frame (no flash). Direction comes from the index delta,
  // so keyboard, speaker NAV, and URL jumps all animate uniformly. The initial
  // render seeds prevIndex === slideIndex, so opening/reloading never animates.
  const [prevIndex, setPrevIndex] = useState(slideIndex)
  const [anim, setAnim] = useState<{ outgoing: number; direction: number } | null>(null)
  if (prevIndex !== slideIndex) {
    if (transition !== "none") {
      setAnim({ outgoing: prevIndex, direction: Math.sign(slideIndex - prevIndex) })
    }
    setPrevIndex(slideIndex)
  }

  // Safety net: clear the transition even if animationend never fires
  // (e.g. backgrounded tab, reduced-motion edge cases).
  useEffect(() => {
    if (!anim) return
    const id = setTimeout(() => setAnim(null), 800)
    return () => clearTimeout(id)
  }, [anim])

  useEffect(() => {
    channel.current = new BroadcastChannel(BROADCAST_CHANNEL)
    channel.current.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type !== "NAV") return
      if (e.data.direction === "next" && slideIndex + 2 <= total) navigate(`/${slideIndex + 2}`)
      if (e.data.direction === "prev" && slideIndex >= 1) navigate(`/${slideIndex}`)
    }
    return () => channel.current?.close()
  }, [slideIndex, total, navigate])

  useEffect(() => {
    const msg: ChannelMessage = {
      type: "SLIDE_STATE",
      slideIndex,
      total,
      notes: notesRef.current,
    }
    channel.current?.postMessage(msg)
  }, [slideIndex, total, notesRef])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        if (slideIndex + 2 <= total) navigate(`/${slideIndex + 2}`)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        if (slideIndex >= 1) navigate(`/${slideIndex}`)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [slideIndex, total, navigate])

  return (
    <DeckContext value={{ title, author, date, total, slideIndex }}>
      <div className={styles.slide}>
        <div className={styles.stage}>
          {anim && (
            <div
              key={`out-${anim.outgoing}`}
              className={`${styles.layer} ${exitClass(transition, anim.direction)}`}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setAnim(null)
              }}
            >
              {slides[anim.outgoing]}
            </div>
          )}
          <div
            key={`in-${slideIndex}`}
            className={`${styles.layer} ${anim ? enterClass(transition, anim.direction) : ""}`}
          >
            {slides[slideIndex]}
          </div>
        </div>
        <footer className={styles.footer}>
          <span>{title}</span>
          <span className={styles.footerCenter}>
            {[author, date].filter(Boolean).join(" · ")}
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
}: {
  title: string
  author?: string
  date?: string
  slides: ReactElement[]
  theme: "auto" | "dark" | "light"
  transition: Transition
}) {
  const total = slides.length
  const notesRef = useRef("")
  const setNotes = useCallback((notes: string) => {
    notesRef.current = notes
  }, [])

  return (
    <NotesContext value={setNotes}>
      <div className={styles.root} data-theme={theme === "auto" ? undefined : theme}>
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
                notesRef={notesRef}
              />
            }
          />
          <Route path="/speaker" element={<SpeakerView slides={slides} />} />
        </Routes>
      </div>
    </NotesContext>
  )
}

export function Deck({ title, author, date, theme = "auto", transition = "none", children }: DeckProps) {
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
      />
    </HashRouter>
  )
}

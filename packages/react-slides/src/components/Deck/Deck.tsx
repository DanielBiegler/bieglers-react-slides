import { useCallback, useEffect, useRef, Children, ReactElement } from "react"
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router"
import { NotesContext } from "../../context/NotesContext"
import { SpeakerView } from "./SpeakerView"
import styles from "./Deck.module.css"
import "../../styles/tokens.css"

interface DeckProps {
  title: string
  theme?: "dark" | "light"
  children: ReactElement | ReactElement[]
}

export const BROADCAST_CHANNEL = "react-slides"

export type ChannelMessage =
  | { type: "SLIDE_STATE"; slideIndex: number; total: number; notes: string }
  | { type: "NAV"; direction: "next" | "prev" }

function SlideShell({
  slides,
  total,
  notesRef,
}: {
  slides: ReactElement[]
  total: number
  notesRef: React.RefObject<string>
}) {
  const { index } = useParams<{ index: string }>()
  const navigate = useNavigate()
  const slideIndex = Math.max(0, Math.min(parseInt(index ?? "1", 10) - 1, total - 1))
  const channel = useRef<BroadcastChannel | null>(null)

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
    <div className={styles.slide}>
      {slides[slideIndex]}
      <span className={styles.progress}>
        {slideIndex + 1} / {total}
      </span>
    </div>
  )
}

function DeckRouter({ slides, theme }: { slides: ReactElement[]; theme: string }) {
  const total = slides.length
  const notesRef = useRef("")
  const setNotes = useCallback((notes: string) => {
    notesRef.current = notes
  }, [])

  return (
    <NotesContext value={setNotes}>
      <div className={styles.root} data-theme={theme}>
        <Routes>
          <Route path="/" element={<Navigate to="/1" replace />} />
          <Route
            path="/:index"
            element={<SlideShell slides={slides} total={total} notesRef={notesRef} />}
          />
          <Route path="/speaker" element={<SpeakerView slides={slides} />} />
        </Routes>
      </div>
    </NotesContext>
  )
}

export function Deck({ title: _title, theme = "dark", children }: DeckProps) {
  const slides = Children.toArray(children) as ReactElement[]
  return (
    <HashRouter>
      <DeckRouter slides={slides} theme={theme} />
    </HashRouter>
  )
}

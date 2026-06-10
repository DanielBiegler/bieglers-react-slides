import { createContext } from "react"

interface DeckContextValue {
  title: string
  author?: string
  date?: string
  total: number
  slideIndex: number
  /** Current step index within the slide (0 = initial state). */
  step: number
}

export const DeckContext = createContext<DeckContextValue>({
  title: "",
  total: 0,
  slideIndex: 0,
  author: undefined,
  date: undefined,
  step: 0,
})

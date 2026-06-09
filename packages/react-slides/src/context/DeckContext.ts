import { createContext } from "react"

interface DeckContextValue {
  title: string
  author?: string
  date?: string
  total: number
  slideIndex: number
}

export const DeckContext = createContext<DeckContextValue>({
  title: "",
  total: 0,
  slideIndex: 0,
  author: undefined,
  date: undefined,
})

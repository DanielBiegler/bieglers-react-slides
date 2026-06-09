import { createContext } from "react"

export const NotesContext = createContext<(notes: string) => void>(() => {})

import { createContext, ReactNode } from "react"

export const NotesContext = createContext<(notes: ReactNode) => void>(() => {})

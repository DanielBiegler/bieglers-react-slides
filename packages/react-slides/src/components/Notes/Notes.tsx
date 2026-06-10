import { ReactNode, useContext, useLayoutEffect } from "react"
import { NotesContext } from "../../context/NotesContext"

interface NotesProps {
  children: ReactNode
}

export function Notes({ children }: NotesProps) {
  const setNotes = useContext(NotesContext)
  useLayoutEffect(() => {
    setNotes(children)
    return () => setNotes(null)
  }, [children, setNotes])
  return null
}

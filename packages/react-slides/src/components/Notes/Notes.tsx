import { useContext, useLayoutEffect } from "react"
import { NotesContext } from "../../context/NotesContext"

interface NotesProps {
  children: string
}

export function Notes({ children }: NotesProps) {
  const setNotes = useContext(NotesContext)
  useLayoutEffect(() => {
    setNotes(children)
    return () => setNotes("")
  }, [children, setNotes])
  return null
}

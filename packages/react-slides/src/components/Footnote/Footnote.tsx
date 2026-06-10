import { ReactNode, useContext, useLayoutEffect } from "react"
import { FootnoteContext } from "../../context/FootnoteContext"

interface FootnoteProps {
  children: ReactNode
}

/**
 * Audience-facing source citation. Place inside any slide; it renders small,
 * muted text pinned to the bottom-left of the slide, above the deck footer.
 * Renders nothing itself — the enclosing slide layer renders the content.
 */
export function Footnote({ children }: FootnoteProps) {
  const register = useContext(FootnoteContext)
  useLayoutEffect(() => {
    register(children)
    return () => register(null)
  }, [register, children])
  return null
}

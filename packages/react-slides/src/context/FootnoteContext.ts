import { createContext, ReactNode } from "react"

/** Lets a <Footnote> register its content with the enclosing slide layer. */
export const FootnoteContext = createContext<(node: ReactNode) => void>(() => {})

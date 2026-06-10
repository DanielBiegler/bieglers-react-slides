import { createContext } from "react"

/** Lets step-capable components register their step count with the enclosing slide layer. */
export const StepsContext = createContext<(count: number) => void>(() => {})

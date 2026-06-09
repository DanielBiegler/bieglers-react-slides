import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import deck from "./deck"

createRoot(document.getElementById("root")!).render(
  <StrictMode>{deck}</StrictMode>
)

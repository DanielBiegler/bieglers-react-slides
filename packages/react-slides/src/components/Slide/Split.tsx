import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import styles from "./Split.module.css"

interface SplitProps {
  left: ReactNode
  right: ReactNode
  mediaPane?: "left" | "right" | "both"
  overrides?: Overrides
}

export function Split({ left, right, mediaPane, overrides }: SplitProps) {
  const leftClass = mediaPane === "left" || mediaPane === "both" ? styles.paneMedia : styles.pane
  const rightClass = mediaPane === "right" || mediaPane === "both" ? styles.paneMedia : styles.pane

  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      <div className={leftClass}>{left}</div>
      <div className={rightClass}>{right}</div>
    </div>
  )
}

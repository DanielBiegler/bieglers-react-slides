import { ReactNode } from "react"
import styles from "./Split.module.css"

interface SplitProps {
  left: ReactNode
  right: ReactNode
  mediaPane?: "left" | "right" | "both"
}

export function Split({ left, right, mediaPane }: SplitProps) {
  const leftClass = mediaPane === "left" || mediaPane === "both" ? styles.paneMedia : styles.pane
  const rightClass = mediaPane === "right" || mediaPane === "both" ? styles.paneMedia : styles.pane

  return (
    <div className={styles.root}>
      <div className={leftClass}>{left}</div>
      <div className={rightClass}>{right}</div>
    </div>
  )
}

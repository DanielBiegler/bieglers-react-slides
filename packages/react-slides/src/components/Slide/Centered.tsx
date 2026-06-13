import { Children, ReactNode, useContext, useLayoutEffect } from "react"
import { DeckContext } from "../../context/DeckContext"
import { StepsContext } from "../../context/StepsContext"
import type { Overrides } from "../../overrides"
import styles from "./Centered.module.css"

interface CenteredProps {
  children: ReactNode
  /** Reveal direct children one by one as the presenter advances.
   *  The first child is visible immediately; each subsequent child fades in on →. */
  reveal?: boolean
  overrides?: Overrides
}

export function Centered({ children, reveal, overrides }: CenteredProps) {
  const register = useContext(StepsContext)
  const { step } = useContext(DeckContext)

  const childArray = Children.toArray(children)
  const stepCount = Math.max(0, childArray.length - 1)

  useLayoutEffect(() => {
    if (!reveal) return
    register(stepCount)
    return () => register(0)
  }, [reveal, stepCount, register])

  if (!reveal) {
    return <div className={styles.root} style={overrides as React.CSSProperties}>{children}</div>
  }

  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      {childArray.map((child, i) => (
        <div
          key={i}
          className={`${styles.revealItem}${step >= i ? "" : ` ${styles.revealItemHidden}`}`}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

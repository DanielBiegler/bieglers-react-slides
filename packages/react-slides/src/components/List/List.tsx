import { ReactNode, useContext, useLayoutEffect } from "react"
import { DeckContext } from "../../context/DeckContext"
import { StepsContext } from "../../context/StepsContext"
import styles from "./List.module.css"

type BorderSide = "left" | "right"

export interface ListItem {
  /** String renders as a bold <strong>; any other ReactNode renders as-is. */
  title: ReactNode
  /** String renders as a styled <p>; any other ReactNode renders as-is. */
  content?: ReactNode
  /** Override the accent color for this item (any CSS color). Defaults to --rs-accent. */
  accent?: string
  /** Override text alignment for this item. Defaults to "right" when border="right", else "left". */
  align?: "left" | "center" | "right"
}

export interface ListProps {
  items: ListItem[]
  /** Border side for all items. Default: "left". */
  border?: BorderSide
  /** Override the accent color for all items (any CSS color). Defaults to --rs-accent. */
  accent?: string
  /**
   * "full" (default) — items span the full available width.
   * "fit" — list shrinks to the width of the widest item; all items match that width.
   */
  sizing?: "full" | "fit"
  /** Reveal items one by one as the presenter advances. */
  reveal?: boolean
}

export function List({ items, border = "left", accent, sizing = "full", reveal }: ListProps) {
  const register = useContext(StepsContext)
  const { step } = useContext(DeckContext)
  const accentVar = accent ?? "var(--rs-accent)"

  useLayoutEffect(() => {
    if (!reveal) return
    register(items.length)
    return () => register(0)
  }, [reveal, items.length, register])

  return (
    <ul className={styles.list} data-sizing={sizing}>
      {items.map((item, i) => {
        const color = item.accent ?? accentVar
        const align = item.align ?? (border === "right" ? "right" : "left")
        const isVisible = !reveal || step > i
        return (
          <li
            key={i}
            className={`${styles.item}${reveal ? ` ${styles.revealItem}` : ""}${reveal && !isVisible ? ` ${styles.itemHidden}` : ""}`}
            data-border={border}
            style={{ "--rs-list-item-accent": color } as React.CSSProperties}
          >
            <div className={styles.itemInner} data-align={align}>
              {typeof item.title === "string"
                ? <strong className={styles.itemTitle}>{item.title}</strong>
                : item.title}
              {item.content !== undefined && (
                typeof item.content === "string"
                  ? <p className={styles.itemContent}>{item.content}</p>
                  : item.content
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

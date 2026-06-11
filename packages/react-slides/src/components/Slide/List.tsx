import { ReactNode } from "react"
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

interface ListProps {
  items: ListItem[]
  /** Optional heading above the list. */
  title?: string
  /** Optional description below the heading. */
  description?: string
  /** Border side for all items. Default: "left". */
  border?: BorderSide
  /** Override the accent color for all items (any CSS color). Defaults to --rs-accent. */
  accent?: string
  /**
   * "full" (default) — items span the full slide width.
   * "fit" — list shrinks to the width of the widest item; all items match that width.
   */
  sizing?: "full" | "fit"
  /** Non-visual helpers such as <Footnote> or <Notes>. */
  children?: ReactNode
}

export function List({ items, title, description, border = "left", accent, sizing = "full", children }: ListProps) {
  const accentVar = accent ?? "var(--rs-accent)"
  return (
    <div className={styles.root}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
      <ul className={styles.list} data-sizing={sizing}>
        {items.map((item, i) => {
          const color = item.accent ?? accentVar
          const align = item.align ?? (border === "right" ? "right" : "left")
          return (
            <li
              key={i}
              className={styles.item}
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
      {children}
    </div>
  )
}

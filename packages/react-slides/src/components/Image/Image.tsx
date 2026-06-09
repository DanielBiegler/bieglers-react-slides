import styles from "./Image.module.css"

interface ImageProps {
  src: string
  alt: string
  fit?: "cover" | "contain" | "fill"
}

export function Image({ src, alt, fit = "cover" }: ImageProps) {
  return (
    <div className={styles.root}>
      <img src={src} alt={alt} className={`${styles.img} ${styles[`fit-${fit}`]}`} />
    </div>
  )
}

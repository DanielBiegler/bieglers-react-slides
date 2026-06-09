import styles from "./Code.module.css"

interface CodeProps {
  code: string
  language?: string
}

export function Code({ code, language }: CodeProps) {
  return (
    <div className={styles.root}>
      {language && (
        <div className={styles.header}>
          <span className={styles.language}>{language}</span>
        </div>
      )}
      <pre className={styles.pre}>
        <code>{code.trim()}</code>
      </pre>
    </div>
  )
}

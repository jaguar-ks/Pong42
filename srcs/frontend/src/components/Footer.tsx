import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>&copy; 2023 Ping Pong World. All rights reserved.</p>
          <div className={styles.links}>
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.link}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


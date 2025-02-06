import Link from "next/link"
import Image from "next/image"
import styles from "./Header.module.css"
import logoImageSVG from "../../assets/Main-Logo.svg"
import headerLine from "../../assets/VectorLine.svg"

interface HeaderProps {
  forWhat: string
}

export function Header({ forWhat }: HeaderProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              <Image className={styles.logoImage} src={logoImageSVG} alt="Logo" />
            </Link>
          </div>
          <div className={styles.linkContainer}>
            <h1 className={styles.title}>{forWhat}</h1>
          </div>
          <div className={styles.linkContainer}>
            <Link href={forWhat === "Sign In" ? "/auth/signup" : "/auth/signin"} className={styles.link}>
              {forWhat === "Sign In" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </div>
      </nav>
      <Image src={headerLine} alt="headerLine" className={styles.corruptedLines} />
    </header>
  )
}


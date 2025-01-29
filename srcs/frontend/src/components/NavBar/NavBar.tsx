"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/context/UserContext"
import classes from "./NavBar.module.css"

// Import your SVG assets here
import chatLogoWhite from "../../../assets/chatLogoWithe.svg"
import chatLogoBlack from "../../../assets/chatLogoBlack.svg"
import gameLogoWhite from "../../../assets/gameLogoWhite.svg"
import gameLogoBlack from "../../../assets/gameLogoBlack.svg"
import homeLogoWhite from "../../../assets/homeLogoWithe.svg"
import homeLogoBlack from "../../../assets/homeLogoBlack.svg"
import leaderboardWhite from "../../../assets/leaderboardWhite.svg"
import leaderboardBlack from "../../../assets/leaderboardBlack.svg"
import hamburgerDotsBlack from "../../../assets/XBlack.svg"

interface NavBarProps {
  onClose: () => void
}

const NavBar: React.FC<NavBarProps> = ({ onClose }) => {
  const router = useRouter()
  const { currentPage, updateCurrentPage } = useUserContext()

  const pages = [
    { name: "home", logoBlack: homeLogoBlack, logoWhite: homeLogoWhite },
    { name: "chat", logoBlack: chatLogoBlack, logoWhite: chatLogoWhite },
    { name: "game", logoBlack: gameLogoBlack, logoWhite: gameLogoWhite },
    { name: "leaderboard", logoBlack: leaderboardBlack, logoWhite: leaderboardWhite },
  ]

  const handlePageChange = (pageName: string) => {
    router.push(`/users/${pageName}`)
    updateCurrentPage(pageName)
    onClose()
  }

  return (
    <nav className={`${classes.navbar} ${classes.navbarOpen}`}>
      <button className={classes.iconButton} onClick={onClose}>
        <Image className={classes.menuDotImage} src={hamburgerDotsBlack || "/placeholder.svg"} alt="Close menu" />
      </button>
      <div className={classes.menuContent}>
        <div className={classes.pagesButtons}>
          {pages.map((item) => (
            <div key={item.name} className={classes.buttonWrapper}>
              <button
                onClick={() => handlePageChange(item.name)}
                className={item.name === currentPage ? classes.buttonSelected : classes.button}
              >
                <Image
                  className={classes.buttonImage}
                  src={item.name === currentPage ? item.logoWhite : item.logoBlack}
                  alt={item.name}
                />
                <p>{item.name}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar


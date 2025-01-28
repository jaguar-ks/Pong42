"use client";

import React from "react";
import chatLogoWhite from '../../../assets/chatLogoWithe.svg';
import chatLogoBlack from '../../../assets/chatLogoBlack.svg';
import gameLogoWhite from '../../../assets/chatLogoWithe.svg';
import gameLogoBlack from '../../../assets/gameLogoBlack.svg';
import homeLogoWhite from '../../../assets/homeLogoWithe.svg';
import homeLogoBlack from '../../../assets/homeLogoBlack.svg';
import leaderboardWhite from '../../../assets/leaderboardWithe.svg';
import leaderboardBlack from '../../../assets/leaderboardBlack.svg';
import hamburgerDotsBlack from '../../../assets/XBlack.svg';
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import classes from './NavBar.module.css';
import { useRouter } from 'next/navigation';

interface NavBarProps {
  onClose: () => void;
}

interface Page {
  name: string;
  logoBlack: string;
  logoWhite: string;
}

const NavBar: React.FC<NavBarProps> = ({ onClose }) => {
  const router = useRouter();
  const pages: Page[] = [
    { name: "home", logoBlack: homeLogoBlack, logoWhite: homeLogoWhite },
    { name: "chat", logoBlack: chatLogoBlack, logoWhite: chatLogoWhite },
    { name: "game", logoBlack: gameLogoBlack, logoWhite: gameLogoWhite },
    { name: "leaderboard", logoBlack: leaderboardBlack, logoWhite: leaderboardWhite },
  ];
  const { currentPage, updateCurrentPage } = useUserContext();

  const handlePageChange = (item: Page) => {
    router.push("/users/" + item.name);
    updateCurrentPage(item.name);
    onClose();
  };

  return (
    <>
      <nav className={classes.navbar}>
        <button className={classes.iconButton} onClick={onClose}>
          <Image className={classes.menuDotImage} src={hamburgerDotsBlack} alt="hamburger Icon" />
        </button>
        <div className={classes.menuContent}>
          <div className={classes.pagesButtons}>
            {pages.map((item) => (
              <button
                onClick={() => handlePageChange(item)}
                key={item.name}
                className={item.name === currentPage ? classes.buttonSelected : classes.button}
              >
                <Image
                  className={classes.buttonImage}
                  src={item.name === currentPage ? item.logoWhite : item.logoBlack}
                  alt={item.name}
                />
                <p>{item.name}</p>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

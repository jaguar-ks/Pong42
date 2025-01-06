"use client";

import React, { useState } from "react";
import chatLogoWithe from '../../../assets/chatLogoWithe.svg';
import chatLogoBlack from '../../../assets/chatLogoBlack.svg';
import gameLogoWithe from '../../../assets/chatLogoWithe.svg';
import gameLogoBlack from '../../../assets/gameLogoBlack.svg';
import homeLogoWithe from '../../../assets/homeLogoWithe.svg';
import homeLogoBlack from '../../../assets/homeLogoBlack.svg';
import leaderboardWithe from '../../../assets/leaderboardWithe.svg';
import leaderboardBlack from '../../../assets/leaderboardBlack.svg';
import SettingsWithe from '../../../assets/SettingsWithe.svg';
import SettingsBlack from '../../../assets/SettingsBlack.svg';
import LogoutWithe from '../../../assets/LogoutWithe.svg';
import LogoutBlack from '../../../assets/LogoutBlack.svg';
import hamburgerDotsBlack from '../../../assets/XBlack.svg'
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import classes from './NavBar.module.css'
import { useRouter } from 'next/navigation'

interface NavBarProps {
    onClose: () => void;
  }

const NavBar = ({onClose}) => {
    const router = useRouter();
    const pages = [
        { name: "home", logoBlack: homeLogoBlack, logoWhite: homeLogoWithe },
        { name: "chat", logoBlack: chatLogoBlack, logoWhite: chatLogoWithe },
        { name: "game", logoBlack: gameLogoBlack, logoWhite: gameLogoWithe },
        { name: "leaderboard", logoBlack: leaderboardBlack, logoWhite: leaderboardWithe },
    ];
    const { currentPage, updateCurrentPage } = useUserContext();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const handlePageChange = (item: string) => {
        router.push("/users/" + item.name)
        updateCurrentPage(item.name);
        onClose();
    };



    return (
        <>
            <nav className={`${classes.navbar} ${isMenuOpen ? classes.navbarOpen : ''}`}>
                <button className={classes.iconButton} onClick={() => onClose()}>
                    <Image className={classes.menuDotImage} src={hamburgerDotsBlack} alt="hamburger Icon" />
                </button>
                <div className={classes.menuContent}>
                    <div className={classes.pagesButtons}>
                        {pages.map((item) => (
                            <button onClick={() =>handlePageChange(item)} key={item.name}>
                                <button
                                    className={item.name === currentPage ? classes.buttonSelected : classes.button}
                                >
                                    <Image 
                                        className={classes.buttonImage} 
                                        src={item.name === currentPage ? item.logoWhite : item.logoBlack} 
                                        alt={item.name} 
                                    />
                                    <p>{item.name}</p>
                                </button>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;


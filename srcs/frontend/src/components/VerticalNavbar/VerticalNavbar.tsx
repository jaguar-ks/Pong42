"use client";

import React, { useContext } from "react";
import classes from './VerticalNavbar.module.css';
import Image from "next/image";
import mainLogo from '../../../assets/Main-Logo.svg';
import chatLogoWithe from '../../../assets/chatLogoWithe.svg';
import chatLogoBlack from '../../../assets/chatLogoBlack.svg';
import gameLogoWithe from '../../../assets/gameLogoWithe.svg';
import gameLogoBlack from '../../../assets/gameLogoBlack.svg';
import homeLogoWithe from '../../../assets/homeLogoWithe.svg';
import homeLogoBlack from '../../../assets/homeLogoBlack.svg';
import leaderboardWithe from '../../../assets/leaderboardWithe.svg';
import leaderboardBlack from '../../../assets/leaderboardBlack.svg';
import SettingsWithe from '../../../assets/SettingsWithe.svg';
import SettingsBlack from '../../../assets/SettingsBlack.svg';
import LogoutWithe from '../../../assets/LogoutWithe.svg';
import LogoutBlack from '../../../assets/LogoutBlack.svg';
import { UserContext } from "../../context/UserContext";

const VerticalNavbar = () => {
    const pagesMiddle = [
        { name: "home", logoBlack: homeLogoBlack, logoWhite: homeLogoWithe },
        { name: "chat", logoBlack: chatLogoBlack, logoWhite: chatLogoWithe },
        { name: "game", logoBlack: gameLogoBlack, logoWhite: gameLogoWithe },
        { name: "leaderboard", logoBlack: leaderboardBlack, logoWhite: leaderboardWithe }
    ];
    const pagesEnd = [
        { name: "settings", logoBlack: SettingsBlack, logoWhite: SettingsWithe },
        { name: "logout", logoBlack: LogoutBlack, logoWhite: LogoutWithe }
    ];
    const { currentPage, updateCurrentPage } = useContext(UserContext);
    const handlePageChange = (page: string) => {
        updateCurrentPage(page);
    };
    return (
        <div className={classes.choices}>
            <div className={classes.logo}>
                <Image className={classes.image} src={mainLogo} alt="My SVG Image" />
            </div>
            <div className={classes.pagesButtons}>
                {pagesMiddle.map((item, index) => (
                    <button
                        key={index}
                        className={item.name === currentPage ? classes.buttonSelected : classes.button}
                        onClick={() => handlePageChange(item.name)}
                    >
                        <Image className={classes.buttonImage} src={item.name === currentPage ? item.logoWhite : item.logoBlack } alt={item.name} />
                    </button>
                ))}
            </div>
            <div className={classes.settingsAndLogout}>
                {pagesEnd.map((item, index) => (
                    <button
                        key={index}
                        className={item.name === currentPage ? classes.buttonSelected : classes.button}
                        onClick={() => handlePageChange(item.name)} 
                    >
                        <Image className={classes.buttonImage} src={item.name === currentPage ? item.logoWhite : item.logoBlack} alt={item.name} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VerticalNavbar;

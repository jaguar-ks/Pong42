"use client";

import React, { useState } from "react";
import styles from './HorizontalNavbar.module.css';
import SearchBar from "./SearchBar/SearchBar";
import MessagesWhite from '../../../assets/MessagesWhite.svg';
import MessagesBlack from '../../../assets/MessagesBlack.svg';
import NotificationsWhite from '../../../assets/NotificationsWhite.svg';
import NotificationsBlack from '../../../assets/NotificationsBlack.svg';
import playerExample from '../../../assets/playerExcemple.jpeg';
import searchIcon from '../../../assets/SearchBlack.svg';
import closeIcon from '../../../assets/XBlack.svg';
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import Notifications from "./ComponentsHB/Notifications";
import Messages from "./ComponentsHB/Messages";
import Profile from "./ComponentsHB/Profile";
import hamburgerDotsBlack from '../../../assets/hamburgerDotsBlack.svg';
import NavBar from "../NavBar/NavBar";

const HorizontalNavbar = () => {
    const [activeIcon, setActiveIcon] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const { userData } = useUserContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleIconToggle = (icon: string) => {
        setActiveIcon(activeIcon === icon ? "" : icon);
    };

    const handleMenuToggle = (status: boolean) => {
        setIsMenuOpen(status);
        console.log("Menu status:", status);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.searchBar}>
                <SearchBar />
            </div>
            <div className={styles.flexWrapper}>
                <div className={styles.containerGroups}>
                    <div className={`${styles.dropdown} ${styles.dropdownSearch}`}>
                        {!isSearchActive && (
                            <button className={styles.iconButton} onClick={() => setIsMenuOpen(true)}>
                                <Image className={styles.menuDotImage} src={hamburgerDotsBlack} alt="hamburger Icon" />
                            </button>
                        )}
                        {!isSearchActive && (
                            <button className={styles.iconButton} onClick={() => setIsSearchActive(true)}>
                                <Image className={styles.menuDotImage} src={searchIcon} alt="Search Icon" />
                            </button>
                        )}
                        {isSearchActive && <SearchBar />}
                    </div>
                </div>
                <div className={styles.containerGroups}>
                    <div className={styles.dropdown}>
                        <button
                            className={isSearchActive ? styles.hidden : activeIcon === "messages" ? styles.iconButtonSelected : styles.iconButton}
                            onClick={() => handleIconToggle("messages")}
                        >
                            <Image className={styles.menuDotImage} src={activeIcon !== "messages" ? MessagesBlack : MessagesWhite} alt="Messages Icon" />
                        </button>
                        {activeIcon === "messages" && <Messages />}
                    </div>
                    <div className={styles.dropdown}>
                        <button
                            className={isSearchActive ? styles.hidden : activeIcon === "notifications" ? styles.iconButtonSelected : styles.iconButton}
                            onClick={() => handleIconToggle("notifications")}
                        >
                            <Image className={styles.menuDotImage} src={activeIcon !== "notifications" ? NotificationsBlack : NotificationsWhite} alt="Notifications Icon" />
                        </button>
                        {activeIcon === "notifications" && <Notifications />}
                    </div>
                    <div className={styles.dropdown}>
                        <button
                            className={isSearchActive ? styles.hidden : styles.profileButton}
                            onClick={() => handleIconToggle("profile")}
                        >
                            <Image
                                width={40}
                                height={40}
                                className={styles.profileImage}
                                src={userData.avatar_url || playerExample}
                                alt="Player Avatar"
                            />
                        </button>
                        {activeIcon === "profile" && <Profile setActiveIcon={setActiveIcon} username={userData.username} />}
                    </div>
                    <div className={styles.dropdownMenuWrapper}>
                        <button
                            className={isSearchActive ? styles.hidden : styles.profileButton}
                            onClick={() => handleMenuToggle(true)}
                        >
                            <Image
                                width={40}
                                height={40}
                                className={styles.menuDotImage}
                                src={hamburgerDotsBlack}
                                alt="Menu Icon"
                            />
                        </button>
                    </div>
                </div>
                {isSearchActive && (
                    <div>
                        <button className={styles.profileButton} onClick={() => setIsSearchActive(false)}>
                            <Image className={styles.iconImage} src={closeIcon} alt="Close Icon" />
                        </button>
                    </div>
                )}
            </div>
            {isMenuOpen && <NavBar onClose={() => setIsMenuOpen(false)} />}
        </div>
    );
};

export default HorizontalNavbar;

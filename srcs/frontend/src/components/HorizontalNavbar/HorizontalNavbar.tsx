"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { useWebSocket } from '@/context/WebSocketContext';


const HorizontalNavbar = () => {
    const [activeIcon, setActiveIcon] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const { userData } = useUserContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);
    const { sendMessage, messages: wsMessages, isConnected , notification, setNotification} = useWebSocket();



    const handleIconToggle = (icon: string) => {
        setActiveIcon(prevIcon => prevIcon === icon ? "" : icon);
        setNotification(false)
    };

    const handleMenuToggle = (status: boolean) => {
        setIsMenuOpen(status);
        console.log("Menu status:", status);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                setActiveIcon("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.navbar} ref={navbarRef}>
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
                <div className="relative">
                        <button
                            className={`${
                                isSearchActive ? 'hidden' : activeIcon === 'notifications' ? 'bg-blue-500' : 'bg-transparent'
                            } flex items-center justify-center p-2 rounded-md hover:bg-gray-200`}
                            onClick={() => handleIconToggle("notifications")}
                        >
                            <Image
                                className="w-6 h-6"
                                src={activeIcon !== "notifications" ? NotificationsBlack : NotificationsWhite}
                                alt="Notifications Icon"
                            />
                        </button>
                        {activeIcon === "notifications" && <Notifications />}
                        {notification && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                    </div>
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


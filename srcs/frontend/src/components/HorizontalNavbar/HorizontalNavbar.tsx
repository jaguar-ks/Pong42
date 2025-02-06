"use client";

import React, { useState, useEffect } from "react";
import styles from './HorizontalNavbar.module.css';
import SearchBar from "./SearchBar/SearchBar";
import NotificationsWhite from '../../../assets/NotificationsWhite.svg';
import NotificationsBlack from '../../../assets/NotificationsBlack.svg';
import searchIcon from '../../../assets/SearchBlack.svg';
import closeIcon from '../../../assets/XBlack.svg';
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import Notifications from "./ComponentsHB/Notifications";
import Profile from "./ComponentsHB/Profile";
import hamburgerDotsBlack from '../../../assets/hamburgerDotsBlack.svg';
import NavBar from "../NavBar/NavBar";
import { useWebSocket } from '@/context/WebSocketContext';

const HorizontalNavbar: React.FC = () => {
    const [activeIcon, setActiveIcon] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const { userData } = useUserContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { notification, setNotification} = useWebSocket();

    useEffect(() => {
        if (userData.has_notif && !notification) {
            setNotification(true);
        }
    }, [userData.has_notif, setNotification]);

    const handleIconToggle = (icon: string) => {
        setActiveIcon(prevIcon => prevIcon === icon ? "" : icon);
        if (icon === "notifications") {
            setNotification(false);
        }
    };

    const handleSearchToggle = (status: boolean) => {
        setIsSearchActive(status);
        handleIconToggle("search");
    }

    const handleMenuToggle = (status: boolean) => {
        setIsMenuOpen(status);
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
                            <button className={styles.iconButton} onClick={() => handleMenuToggle(true)}>
                                <Image className={styles.menuDotImage} src={hamburgerDotsBlack || "/placeholder.svg"} alt="hamburger Icon" />
                            </button>
                        )}
                        {!isSearchActive && (
                            <button className={styles.iconButton} onClick={() => handleSearchToggle(true)}>
                                <Image className={styles.menuDotImage} src={searchIcon || "/placeholder.svg"} alt="Search Icon" />
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
                                src={userData.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
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
                                src={hamburgerDotsBlack || "/placeholder.svg"}
                                alt="Menu Icon"
                            />
                        </button>
                    </div>
                </div>
                {isSearchActive && (
                    <div>
                        <button className={styles.profileButton} onClick={() => setIsSearchActive(false)}>
                            <Image className={styles.iconImage} src={closeIcon || "/placeholder.svg"} alt="Close Icon" />
                        </button>
                    </div>
                )}
            </div>
            {isMenuOpen && <NavBar onClose={() => setIsMenuOpen(false)} />}
        </div>
    );
};

export default HorizontalNavbar;

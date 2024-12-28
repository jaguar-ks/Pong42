"use client";

import React, { useState } from "react";
import classes from './HorizontalNavbar.module.css';
import SearchBar from "./SearchBar/SearchBar";
import MessagesWhite from '../../../assets/MessagesWhite.svg'
import MessagesBlack from '../../../assets/MessagesBlack.svg'
import notificationsWhite from '../../../assets/NotificationsWhite.svg'
import NotificationsBlack from '../../../assets/NotificationsBlack.svg'
import playerExcemple from '../../../assets/playerExcemple.jpeg'
import serchIcon from '../../../assets/SearchBlack.svg'
import ex from '../../../assets/XBlack.svg'
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import Notifications from "./ComponentsHB/Notifications";
import Messages from "./ComponentsHB/Messages";
import Profile from "./ComponentsHB/Profile";

const HorizontalNavbar = () => {
    const [selectedIcon, setSelectedIcon] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const { userData } = useUserContext();

    const toggleDropdown = (icon: string) => {
        setSelectedIcon(selectedIcon === icon ? "" : icon);
    };

    return (
        <div className={classes.container}>
            <div className={classes.searchBar}>
                <SearchBar />
            </div>
            <div className={classes.searchButton}>
                {!isSearchActive && (
                    <button className={classes.iconsContainer} onClick={() => setIsSearchActive(true)}>
                        <Image className={classes.image} src={serchIcon} alt="messages logo black" />
                    </button>
                )}
                {isSearchActive && <SearchBar />}
            </div>
            <div className={classes.container2}>
                <div className={classes.dropdownWrapper}>
                    <button
                        className={isSearchActive ? classes.displayNone : selectedIcon === "msg" ? classes.iconsContainerSelected : classes.iconsContainer}
                        onClick={() => toggleDropdown("msg")}
                    >
                        <Image className={classes.image} src={selectedIcon === "msg" ? MessagesWhite : MessagesBlack} alt="messages logo" />
                    </button>
                    {selectedIcon === "msg" && <Messages />}
                </div>
                <div className={classes.dropdownWrapper}>
                    <button
                        className={isSearchActive ? classes.displayNone : selectedIcon === "notif" ? classes.iconsContainerSelected : classes.iconsContainer}
                        onClick={() => toggleDropdown("notif")}
                    >
                        <Image className={classes.image} src={selectedIcon === "notif" ? notificationsWhite : NotificationsBlack} alt="notification logo" />
                    </button>
                    {selectedIcon === "notif" && <Notifications />}
                </div>
                <div className={classes.dropdownWrapper}>
                    <button
                        className={isSearchActive ? classes.displayNone : classes.profile}
                        onClick={() => toggleDropdown("profile")}
                    >
                        <Image
                            width={40}
                            height={40}
                            className={classes.imageProfile}
                            src={userData.avatar_url || "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"}
                            alt="player image"
                        />
                    </button>
                    {selectedIcon === "profile" && <Profile setSelectedIcon={setSelectedIcon} username={userData.username} />}
                </div>
                {isSearchActive && (
                    <button className={classes.X} onClick={() => setIsSearchActive(false)}>
                        <Image className={classes.image} src={ex} alt="X black" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default HorizontalNavbar;


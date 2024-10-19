"use client";

import React, { useContext, useState } from "react";
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

const HorizontalNavbar = () => {

    const [selectedIcon, setSelectedIcon] = useState("");
    const [searchActive, setSearchActive] = useState(false);

    return (
        <div className={classes.container}>
            <div className={classes.searchBar}>
                <SearchBar/>
            </div>
            <div className={classes.searchButton}>
                {!searchActive && <button className={classes.iconsContainer} onClick={() => setSearchActive(true)}>
                    <Image className={classes.image} src={serchIcon} alt="messages logo black" />
                </button>}
                {searchActive && <SearchBar/>}
            </div>
            <div className={classes.container2}>
                <button className={searchActive ? classes.iconsContainerSearchActive : selectedIcon === "msg" ? classes.iconsContainerSelected : classes.iconsContainer} onClick={() => selectedIcon !== "msg" ? setSelectedIcon("msg") : setSelectedIcon("") }>
                    <Image className={classes.image} src={selectedIcon === "msg" ? MessagesWhite : MessagesBlack} alt="messages logo black" />
                </button>
                <button className={searchActive ? classes.iconsContainerSearchActive :  selectedIcon === "notif" ? classes.iconsContainerSelected : classes.iconsContainer} onClick={() => selectedIcon !== "notif" ? setSelectedIcon("notif") : setSelectedIcon("") }>
                    <Image className={classes.image} src={selectedIcon === "notif" ? notificationsWhite : NotificationsBlack} alt="notification logo black" />
                </button>
                <button className={searchActive ? classes.iconsContainerSearchActive : classes.profile}>
                    <Image className={classes.image} src={playerExcemple} alt="player image excemple" />
                </button>
                { searchActive && <button className={classes.X} onClick={() => setSearchActive(false)}>
                    <Image className={classes.image} src={ex} alt="X black" />
                </button>}
            </div>
        </div>
    );
};

export default HorizontalNavbar;

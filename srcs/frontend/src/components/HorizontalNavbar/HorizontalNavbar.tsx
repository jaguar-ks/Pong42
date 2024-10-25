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
import { useUserContext } from "@/context/UserContext";

const HorizontalNavbar = () => {

    const [selectedIcon, setSelectedIcon] = useState("");
    const [isSeaerchActive, setIsSearchActive] = useState(false);
    const {userData}  = useUserContext();


    return (
        <div className={classes.container}>
            <div className={classes.searchBar}>
                <SearchBar/>
            </div>
            <div className={classes.searchButton}>
                {!isSeaerchActive && <button className={classes.iconsContainer} onClick={() => setIsSearchActive(true)}>
                    <Image className={classes.image} src={serchIcon} alt="messages logo black" />
                </button>}
                {isSeaerchActive && <SearchBar/>}

            </div>
            <div className={classes.container2}>
                <button className={ isSeaerchActive ? classes.displayNone : selectedIcon === "msg" ? classes.iconsContainerSelected : classes.iconsContainer} onClick={() => selectedIcon !== "msg" ? setSelectedIcon("msg") : setSelectedIcon("") }>
                    <Image className={classes.image} src={selectedIcon === "msg" ? MessagesWhite : MessagesBlack} alt="messages logo black" />
                </button>
                <button className={ isSeaerchActive ? classes.displayNone : selectedIcon === "notif" ? classes.iconsContainerSelected : classes.iconsContainer} onClick={() => selectedIcon !== "notif" ? setSelectedIcon("notif") : setSelectedIcon("") }>
                    <Image className={classes.image} src={selectedIcon === "notif" ? notificationsWhite : NotificationsBlack} alt="notification logo black" />
                </button>
                <button className={isSeaerchActive ? classes.displayNone :classes.profile}>
                    <Image width={40} height={40} className={classes.image} src={userData.avatar_url ? userData.avatar_url : "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} alt="player image excemple" />
                </button>
                {isSeaerchActive && <button className={classes.X}  onClick={() => setIsSearchActive(false)}>
                    <Image className={classes.image} src={ex} alt="X black" />
                </button>}
            </div>
        </div>
    );
};

export default HorizontalNavbar;

"use client";

import React, { useContext, useEffect } from "react";
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
import { UserContext, useUserContext } from "../../context/UserContext";
import Link from "next/link";
import axios from "axios";

const VerticalNavbar = () => {
    const pages = [
        { name: "home", logoBlack: homeLogoBlack, logoWhite: homeLogoWithe },
        { name: "chat", logoBlack: chatLogoBlack, logoWhite: chatLogoWithe },
        { name: "game", logoBlack: gameLogoBlack, logoWhite: gameLogoWithe },
        { name: "leaderboard", logoBlack: leaderboardBlack, logoWhite: leaderboardWithe },
        { name: "settings", logoBlack: SettingsBlack, logoWhite: SettingsWithe },
        { name: "logout", logoBlack: LogoutBlack, logoWhite: LogoutWithe }
    ];

    const { currentPage, updateCurrentPage } = useUserContext();

    const handlePageChange = (page: string) => {
        updateCurrentPage(page);
    };

    useEffect(() => {
    
        const fetchData = async () =>{
            try {
                const res = await axios.get("http://localhost:8000/api/users/me/", {
                    withCredentials: true
                  });
                console.log("res");
                console.log(res.data);
                updateUserData({
                    id: res.data.id,
                    otp_uri: res.data.otp_uri,
                    last_login: res.data.last_login,
                    is_superuser: res.data.is_superuser,
                    username: res.data.username,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    email: res.data.email,
                    is_staff: res.data.is_staff,
                    is_active: res.data.is_active,
                    date_joined: res.data.date_joined,
                    two_fa_enabled: res.data.two_fa_enabled,
                    is_online: res.data.is_online,
                    avatar_url: res.data.avatar_url ,
                    wins: res.data.wins,
                    loses: res.data.loses,
                    rating: res.data.rating,
                })


            } catch (err) {
                console.log("test");
            }
        }

        fetchData();
      }, []);
    



    return (
        <nav className={classes.navbar}>
            <div className={classes.logo}>
                <Image className={classes.image} src={mainLogo} alt="Main Logo" />
            </div>
            <div className={classes.pagesButtons}>
                {pages.slice(0, 4).map((item) => (
                    <Link href={"/users/" + item.name} key={item.name}>
                        <button
                            className={item.name === currentPage ? classes.buttonSelected : classes.button}
                            onClick={() => handlePageChange(item.name)}
                        >
                            <Image 
                                className={classes.buttonImage} 
                                src={item.name === currentPage ? item.logoWhite : item.logoBlack} 
                                alt={item.name} 
                            />
                        </button>
                    </Link>
                ))}
            </div>
            <div className={classes.settingsAndLogout}>
                {pages.slice(4).map((item) => (
                    <Link href={"/users/" + item.name} key={item.name}>
                        <button
                            className={item.name === currentPage ? classes.buttonSelected : classes.button}
                            onClick={() => handlePageChange(item.name)}
                        >
                            <Image 
                                className={classes.buttonImage} 
                                src={item.name === currentPage ? item.logoWhite : item.logoBlack} 
                                alt={item.name} 
                            />
                        </button>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default VerticalNavbar;
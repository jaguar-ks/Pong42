"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import PlayerInfos from "@/components/PlayerInfos/PlayerInfos";
import WeeklyAttendance from "@/components/weeklyAttendance/WeeklyAttendance";
import Rate from "@/components/Rate/Rate";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import Friends from "@/components/Friends/Friends";
import { Achievements } from "@/components/Achievements/Achievements";
import classes from "./page.module.css";
import FriendsFR from "@/components/FriendsFR/FriendsFR";
import Image from "next/image";
import userNotFoundImage from '../../../../../assets/userNotFound.svg'

const SearchProfile = () => {
  const { updateSearchedUserData, updateCurrentPage, searchedUserData, updateUserDataSearch } = useUserContext();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    updateCurrentPage("");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://localhost/api/users/${id}/`, {
          withCredentials: true,
        });
        console.log("Fetched Data:", res.data);

        updateSearchedUserData(res.data);
        updateUserDataSearch(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err.response.data.detail);
        if(err?.response?.data?.detail)
          {
            console.log(err?.response?.data?.detail);
            
          }
          setUserExist(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={classes.home}>
      {isLoading ? (
        <div>Loading...</div>
      ) : !userExist ? (
        <div className={classes.container}>
          <div className={classes.box1}>
            <PlayerInfos user="search" />
          </div>
          <div className={classes.box2}>
            <WeeklyAttendance user="search" />
          </div>
          <div className={classes.box3}>
            <Rate user="search" />
          </div>
          <div className={classes.line}>
            <ProgressBar user="search" />
          </div>
          <div className={classes.box4}>
            <FriendsFR id={id} />
          </div>
          <div className={classes.box5}>
            <Achievements user="search" />
          </div>
          <div className={classes.box6}>Line 6</div>
        </div>
      ) : (
        <div className={classes.notFoundContainer}>
          <Image width={100} height={100} src={userNotFoundImage} alt="user not found" className={classes.userNotFoundImage}/>
          <p className={classes.notFoundMessage}>This user does not exist.</p>
          <button className={classes.homeButton} onClick={() => window.location.href = '/users/home'}>
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchProfile;


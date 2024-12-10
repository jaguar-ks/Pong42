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

const SearchProfile = () => {
  const { updateSearchedUserData, updateCurrentPage, searchedUserData, updateUserDataSearch } = useUserContext();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateCurrentPage("");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}/`, {
          withCredentials: true,
        });
        console.log("Fetched Data:", res.data);

        updateSearchedUserData(res.data);
        updateUserDataSearch(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
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
      ) : (
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
            <FriendsFR user="search" />
          </div>
          <div className={classes.box5}>
            <Achievements user="search" />
          </div>
          <div className={classes.box6}>Line 6</div>
        </div>
      )}
    </div>
  );
};

export default SearchProfile;


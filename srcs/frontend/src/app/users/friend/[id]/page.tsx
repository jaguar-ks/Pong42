"use client"
import React, { useEffect } from 'react'
import classes from "./page.module.css"
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'
import axios from 'axios'
import PlayerInfosFr from '@/components/FriendPage/PlayerInfos/PlayerInfosFr'
import WeeklyAttendanceFr from '@/components/FriendPage/WeeklyAttendance/WeeklyAttendanceFr'
import RateFr from '@/components/FriendPage/Rate/RateFr'
import ProgressBarFr from '@/components/FriendPage/ProgressBar/ProgressBarFr'
import { AchievementsFr } from '@/components/FriendPage/Achievements/AchievementsFr'
import FriendActions from '@/components/FriendPage/FriendActions/FriendActions'

interface FriendPageProps {
  params: {
    id: string;
  };
}

const FriendPage: React.FC<FriendPageProps> = ({ params }) => {
  const { id } = params;
  const { updateCurrentPage, updateSearchedUserData } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    updateCurrentPage("Friend");
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await axios.get("http://localhost:8000/api/auth/test_auth/", { withCredentials: true })
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } 
    };
    checkToken();

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}/`);
        updateSearchedUserData({
          avatar_url: res.data.avatar_url,
          first_name: res.data.first_name,
          id: res.data.id,
          is_online: res.data.is_online,
          last_name: res.data.last_name,
          loses: res.data.loses,
          rating: res.data.rating,
          username: res.data.username,
          wins: res.data.wins,
        });
      } catch (err) {
        console.log("Error in fetching user data", err);
      }
    };
    fetchData();
  }, [id, router, updateCurrentPage, updateSearchedUserData]);

  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div className={classes.box1}><PlayerInfosFr /></div>
        <div className={classes.box2}><WeeklyAttendanceFr /></div>
        <div className={classes.box3}><RateFr /></div>
        <div className={classes.line}><ProgressBarFr /></div>
        <div className={classes.box4}><FriendActions /></div>
        <div className={classes.box5}><AchievementsFr /></div>
        <div className={classes.box6}>testttt</div>
      </div>
    </div>
  );
};

export default FriendPage;

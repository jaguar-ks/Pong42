"use client"
import React, { useContext, useEffect, useState } from 'react'
import classes from "./page.module.css"
import PlayerInfos from '../../../components/PlayerInfos/PlayerInfos'
import WeeklyAttendance from '../../../components/weeklyAttendance/WeeklyAttendance'
import Rate from '../../../components/Rate/Rate'
import ProgressBar from '../../../components/ProgressBar/ProgressBar'
import Friends from '../../../components/Friends/Friends'
import { Achievements } from '../../../components/Achievements/Achievements'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/UserContext'
// import loadMyData from '@/Components/LoadMyData'
const Home = () => {
  const {updateCurrentPage } = useContext(UserContext);

  const router = useRouter();
  useEffect(() => {
    updateCurrentPage("Home");
    const fetchData = async () => {

    };

    fetchData();
  }, []);
  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div className={classes.box1}><PlayerInfos/></div>
        <div className={classes.box2}><WeeklyAttendance/></div>
        <div className={classes.box3}><Rate/></div>
        <div className={classes.line}><ProgressBar/></div>
        <div className={classes.box4}><Friends/></div>
        <div className={classes.box5}><Achievements/></div>
        <div className={classes.box6}>lin6</div>
      </div>
    </div>)
}

export default Home

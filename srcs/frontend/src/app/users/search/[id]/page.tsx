"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useUserContext } from "@/context/UserContext"
import PlayerInfos from "@/components/PlayerInfos/PlayerInfos"
import WeeklyAttendance from "@/components/weeklyAttendance/WeeklyAttendance"
import Rate from "@/components/Rate/Rate"
import classes from "./page.module.css"
import FriendsFR from "@/components/FriendsFR/FriendsFR"
import Image from "next/image"
import userNotFoundImage from "../../../../../assets/userNotFound.svg"
import { MatchHistoryFr } from "@/components/MatchHistoryFr/MatchHistoryFr"
import ProgressBarFr from "@/components/ProgressBarFr/ProgressBarFr"
import { AchievementsFr } from "@/components/AchievementsFr/AchievementsFr"
import axios from "axios"
import { useWebSocket } from "@/context/WebSocketContext"
import Api from "@/lib/api"

const SearchProfile = () => {
  const { updateSearchedUserData, updateCurrentPage, searchedUserData, updateUserDataSearch } = useUserContext()
  const { id } = useParams()
  const { connectionUpdate, setConnectionUpdate } = useWebSocket()

  const [isLoading, setIsLoading] = useState(true)
  const [userExist, setUserExist] = useState(false)

  useEffect(() => {
    updateCurrentPage("")

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await Api.get(`/users/${id}/`, {
          withCredentials: true,
        })
        console.log("Fetched Data:", res.data)

        updateSearchedUserData(res.data)
        updateUserDataSearch(res.data)
        setUserExist(false)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setUserExist(true)
        } else {
          setUserExist(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
      if (connectionUpdate) {
        setConnectionUpdate(false)
      }
    } else {
      setUserExist(true)
      setIsLoading(false)
    }
  }, [id, updateCurrentPage, updateSearchedUserData, updateUserDataSearch, connectionUpdate, setConnectionUpdate])

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
            <ProgressBarFr ratingFr={searchedUserData.rating} />
          </div>
          <div className={classes.box4}>
            <FriendsFR id={id} />
          </div>
          <div className={classes.box5}>
            <AchievementsFr
              wins={searchedUserData.wins}
              loses={searchedUserData.loses}
              rating={searchedUserData.rating}
            />
          </div>
          <div className={classes.box6}>
            <MatchHistoryFr id={id} />
          </div>
        </div>
      ) : (
        <div className={classes.notFoundContainer}>
          <Image
            width={100}
            height={100}
            src={userNotFoundImage || "/placeholder.svg"}
            alt="user not found"
            className={classes.userNotFoundImage}
          />
          <p className={classes.notFoundMessage}>This user does not exist.</p>
          <button className={classes.homeButton} onClick={() => (window.location.href = "/users/home")}>
            Go to Home
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchProfile


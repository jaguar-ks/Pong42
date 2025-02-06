"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useUserContext } from "@/context/UserContext"
import classes from "./MatchHistory.module.css"
import playerIcon from "../../../assets/player.png"
import Api from "@/lib/api"

interface Player {
  id: number
  username: string
  avatar_url: string
}

interface MatchData {
  id: number
  player1: Player
  player2: Player
  player1score: number
  player2score: number
  created_at: string
}

export const MatchHistory = () => {
  const { userData } = useUserContext()
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await Api.get(`/pongue/me/matches`, { withCredentials: true })
        setMatches(res.data.results)
      } catch (err) {
        setError("Failed to load match history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (typeof userData.id === "number") {
      fetchData()
    }
  }, [userData.id])

  const getMatchResult = (match: MatchData) => {
    if (match.player1.id === userData.id) {
      return match.player1score > match.player2score ? "win" : "loss"
    } else {
      return match.player2score > match.player1score ? "win" : "loss"
    }
  }

  const getOpponent = (match: MatchData) => {
    return match.player1.id === userData.id ? match.player2 : match.player1
  }

  if (loading) {
    return <div className={classes.loading}>Loading match history...</div>
  }

  if (error) {
    return <div className={classes.error}>{error}</div>
  }

  return (
    <div className={classes.matchHistory}>
      <h1 className={classes.title}>Match History</h1>
      <div className={classes.matchesContainer}>
        {matches.map((match) => {
          const result = getMatchResult(match)
          const opponent = getOpponent(match)
          const score = `${match.player1score}-${match.player2score}`

          return (
            <div key={match.id} className={`${classes.matchItem} ${classes[result]}`}>
              <div className={classes.date}>{match.created_at}</div>
              <div className={classes.details}>
                <div className={classes.opponent}>
                  <Image
                    src={opponent.avatar_url || playerIcon || "/placeholder.svg"}
                    alt={opponent.username}
                    width={24}
                    height={24}
                    className={classes.playerIcon}
                  />
                  <span>{opponent.username}</span>
                </div>
                <div className={classes.score}>{score}</div>
              </div>
              <div className={classes.result}>{result.toUpperCase()}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

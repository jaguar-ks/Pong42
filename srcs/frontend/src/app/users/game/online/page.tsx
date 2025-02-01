"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TableIcon as TableTennis } from "lucide-react"
import { useGameSocket } from "@/context/GameSocketContext"
import GameComponent from "./gameComponent"
import Image from "next/image"

const players = [
  { id: 1, name: "Sam", avatar: "/animalsProfile/dankyprofile.png" },
  { id: 2, name: "Jamie", avatar: "/animalsProfile/dogprofile.png" },
  { id: 3, name: "Taylor", avatar: "/animalsProfile/lionprofile.png" },
  { id: 4, name: "Alex", avatar: "/animalsProfile/catprofile.png" },
]

export default function PingPongMatchup() {
  const { stageReady, setGameStarted, me, disconnectSocket } = useGameSocket()
  const player1 = {
    id: me.id,
    name: me.username,
    avatar: me.avatar,
  }
  const [player2, setPlayer2] = useState(players[0])
  const [isMatching, setIsMatching] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {

    let interval: NodeJS.Timeout

    if (!stageReady && isMatching) {
      interval = setInterval(() => {
        setPlayer2(players[Math.floor(Math.random() * players.length)])
      }, 100)
    }

    return () => {
      clearInterval(interval)
    }
  }, [stageReady, isMatching, me])

  useEffect(() => {
    if (stageReady) {
      setMatchFound(true)
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      const timeout = setTimeout(() => {
        clearInterval(countdownInterval)
      }, 5000)

      return () => {
        clearInterval(countdownInterval)
        clearTimeout(timeout)
      }
    }
  }, [stageReady])

  const handleCancelMatch = () => {
    setIsMatching(false)
    setGameStarted(false)
    disconnectSocket()
  }

  const startMatching = () => {
    setIsMatching(true)
    setGameStarted(true)
  }

  return (!stageReady ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-200 to-green-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
      </div>

      <TableTennis className="absolute top-10 left-10 text-white opacity-30 w-16 h-16" />
      <TableTennis className="absolute bottom-10 right-10 text-white opacity-30 w-16 h-16" />

      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Ping Pong Matchup</h1>

      {isMatching ? (
        <div className="flex justify-between items-center w-full max-w-2xl mb-8 z-10">
          <PlayerCard player={player1} color="blue" />
          <div className="text-5xl font-bold text-white drop-shadow-lg">VS</div>
          <PlayerCard player={player2} color="red" />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full  mb-8">
          <PlayerCard player={player1} color="blue" />
        </div>
      )}

      <div>
        {isMatching ? (
          <div className="flex flex-col justify-center items-center w-full mb-8">
            <div className="text-3xl font-bold mb-4 text-white bg-green-600 px-6 py-2 rounded-full drop-shadow-lg animate-fade-in">
              Searching for Opponent...
            </div>
            <Button
              onClick={handleCancelMatch}
              disabled={stageReady}
              className="px-6 py-2 text-lg bg-red-500 hover:bg-red-200 text-black"
            >
              Cancel
            </Button>
          </div>

        ) : (
          <Button
            onClick={startMatching}
            disabled={isMatching}
            className="px-6 py-2 text-lg bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Find Opponent
          </Button>
        )}
      </div>
    </div>
  ) : matchFound && countdown > 0 ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-200 to-green-500 p-4 relative overflow-hidden">
      <div className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Match Found!</div>
      <div className="text-2xl font-bold mb-8 text-white drop-shadow-lg">Starting in {countdown} seconds...</div>
    </div>
  ) : (
    <GameComponent />
  ))
}

interface Player {
  id: number;
  name: string;
  avatar: string;
}

function PlayerCard({ player, color }: { player: Player, color: string }) {
  return (
    <div className="text-center bg-white p-4 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
      <div className={`w-32 h-32 rounded-full border-4 border-${color}-500 overflow-hidden`}>
        <Image
          src={player.avatar || "/placeholder.svg"}
          alt={player.name}
          className="w-full h-full object-cover animate-pulse"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}
"use client"

import React, { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { TableIcon as TableTennis } from "lucide-react"
import { UserContext } from "@/context/UserContext"
import { useGameSocket } from "@/context/GameSocketContext"
import GameComponent from "./gameComponent"
import Image from "next/image"

const players = [
  { id: 1, name: "Alex", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Sam", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Jamie", image: "/placeholder.svg?height=100&width=100" },
  { id: 4, name: "Taylor", image: "/placeholder.svg?height=100&width=100" },
  { id: 5, name: "Jordan", image: "/placeholder.svg?height=100&width=100" },
]

export default function PingPongMatchup() {
  const {stageReady, setGameStarted, myPaddel, oppPaddel, ball} = useGameSocket()
  const { userData } = useContext(UserContext)
  const [player1, setPlayer1] = useState<Player>({
    id: 0,
    name: "You",
    image: '/placeholder.svg?height=100&width=100',
  })
  const [player2, setPlayer2] = useState(players[1])
  const [isMatching, setIsMatching] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const [noPlayerFound, setNoPlayerFound] = useState(false)
  
  
  useEffect(() => {
    setPlayer1({ id: userData.id, name: userData.username, image: userData.avatar_url })
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout
    
    if (isMatching && !matchFound) {
      interval = setInterval(() => {
        setPlayer2(players[Math.floor(Math.random() * players.length)])
      }, 100)
      
      timeout = setTimeout(() => {
        clearInterval(interval)
        setIsMatching(false)
        setGameStarted(true)
        setNoPlayerFound(true)
      }, 2000)
    }
    
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isMatching, matchFound, userData, setGameStarted])
  
  const startMatching = () => {
    setIsMatching(true)
    setMatchFound(false)
    setNoPlayerFound(false)
  }


  return (!stageReady ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-200 to-green-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
      </div>

      <TableTennis className="absolute top-10 left-10 text-white opacity-30 w-16 h-16" />
      <TableTennis className="absolute bottom-10 right-10 text-white opacity-30 w-16 h-16" />

      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Ping Pong Matchup</h1>

      <div className="flex justify-between items-center w-full max-w-2xl mb-8 z-10">
        <PlayerCard player={player1} color="blue" />
        <div className="text-5xl font-bold text-white drop-shadow-lg">VS</div>
        <PlayerCard player={player2} color="red" />
      </div>

      <div>
        {matchFound ? (
          <div className="text-3xl font-bold mb-4 text-white bg-green-600 px-6 py-2 rounded-full drop-shadow-lg animate-fade-in">
            Match Found!
          </div>
        ) : noPlayerFound ? (
          <div className="text-3xl font-bold mb-4 text-white bg-red-600 px-6 py-2 rounded-full drop-shadow-lg animate-fade-in">
            No Player Found in Lobby
          </div>
        ) : (
          <Button
            onClick={startMatching}
            disabled={isMatching}
            className="px-6 py-2 text-lg bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {isMatching ? "Matching..." : "Find Opponent"}
          </Button>
        )}
      </div>
    </div>
  ) : (
    <GameComponent player1={myPaddel} player2={oppPaddel} ball={ball} />
  ))
}

interface Player {
  id: number;
  name: string;
  image: string;
}

function PlayerCard({ player, color }: { player: Player, color: string }) {
  return (
    <div className="text-center bg-white p-4 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
      <div className={`w-32 h-32 rounded-full border-4 border-${color}-500 overflow-hidden`}>
        <Image
          src={player.image || "/placeholder.svg"}
          alt={player.name}
          className="w-full h-full object-cover animate-pulse"
          width={32}
          height={32}
        />
      </div>
    </div>
  )
}

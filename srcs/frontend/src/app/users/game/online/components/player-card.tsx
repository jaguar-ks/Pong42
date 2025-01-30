"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { MicOff, Trophy } from 'lucide-react'
import { useGameSocket } from "@/context/GameSocketContext"

interface Player {
  id: number
  username: string
  avatar: string
}

export function PlayerCard({direction}) {

  const { me, opp } = useGameSocket();
  const playr = direction === 'left' ? me : opp;

  console.log('PLAYER : ',playr);

  return (
    <Card className={cn(
      "relative flex items-center gap-4 p-4 transition-all duration-300",
      "bg-gradient-to-br from-background to-muted",
      direction === 'right' ? "flex-row" : "flex-row-reverse"
    )}>
      <div className={cn(
        "flex flex-col gap-2 px-4",
        direction === 'right' ? "items-start" : "items-end"
      )}>
        {/* Username and Avatar in the same row */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <img
            src={playr.current.avatar || "/placeholder.svg"}
            alt={playr.current.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Username */}
          <span className="text-lg font-semibold">{playr.current.username}</span>
        </div>
      </div>

      {/* {playr.id === winner.id && (
        <div className="absolute -top-2 -right-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
        </div>
      )} */}
    </Card>
  )
}


"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MicOff, Trophy } from 'lucide-react'
import type { PlayerInfoProps } from "./types/game"

export function PlayerCard({
  source,
  playerName,
  playerScore,
  direction,
  rank = "Rookie",
  isActive = false,
  isMuted = false
}: PlayerInfoProps) {
  return (
    <Card className={cn(
      "relative flex items-center gap-4 p-4 transition-all duration-300",
      "bg-gradient-to-br from-background to-muted",
      direction === 'right' ? "flex-row" : "flex-row-reverse",
      isActive && "ring-2 ring-primary ring-offset-2"
    )}>
      <div className="relative">
        <Image
          src={source}
          width={56}
          height={56}
          alt={playerName}
          className="rounded-full object-cover"
          priority
        />
        {isMuted && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-destructive p-1">
            <MicOff className="h-3 w-3 text-destructive-foreground" />
          </div>
        )}
      </div>

      <div className={cn(
        "flex flex-col",
        direction === 'right' ? "items-start" : "items-end"
      )}>
        <span className="text-lg font-semibold">{playerName}</span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {playerScore}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {rank}
          </Badge>
        </div>
      </div>

      {playerScore > 0 && (
        <div className="absolute -top-2 -right-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
        </div>
      )}
    </Card>
  )
}


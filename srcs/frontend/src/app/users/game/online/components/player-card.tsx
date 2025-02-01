"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useGameSocket } from "@/context/GameSocketContext"

export function PlayerCard({direction}) {
  const { me, opp } = useGameSocket();
  const playr = direction === 'left' ? me : opp;

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
        <div className="flex items-center gap-2">
          <Image
            src={playr.avatar || "/placeholder.svg"}
            alt={playr.username}
            className="w-12 h-12 rounded-full object-cover"
            width={12}
            height={12}
          />
          <span className="text-lg font-semibold">{playr.username}</span>
        </div>
      </div>
    </Card>
  )
}


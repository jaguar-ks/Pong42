"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function PlayerCard({
  playerName,
  direction,
}) {
  return (
    <Card className={cn(
      "relative flex items-center gap-4 p-4 transition-all duration-300",
      "bg-gradient-to-br from-background to-muted",
      direction === 'right' ? "flex-row" : "flex-row-reverse"
    )}>

      <div className={cn(
        "flex flex-col gap-4 px8",
        direction === 'right' ? "items-start" : "items-end"
      )}>
        <span className="text-lg font-semibold">{playerName}</span>
        <div className="flex items-center gap-2">
        </div>
      </div>
    </Card>
  )
}

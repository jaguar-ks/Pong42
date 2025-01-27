"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ChevronRight } from "lucide-react"

interface WinningBoardProps {
  player: string
  onNextRound: () => void
}

export default function WinningBoard({ player, onNextRound }: WinningBoardProps) {
  console.log("hello")
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Ping Pong Winner</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onNextRound}>
          Next Round
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}


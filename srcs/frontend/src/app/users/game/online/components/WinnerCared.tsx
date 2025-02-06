"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ChevronRight } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { useGameSocket } from "@/context/GameSocketContext"

interface Player {
  id: number
  username: string
  avatar: string
}

interface WinningBoardProps {
  player: Player
  winner: Player
}

export default function WinningBoard({ player, winner }: WinningBoardProps) {
  const router = useRouter()
  const { disconnectSocket, setRoom } = useGameSocket()

  const handleClick = () => {
    disconnectSocket()
    setRoom(null)
    router.push('/users/game')
  }

  const isWinner = winner?.id === player.id

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">  {/* Removed mx-auto (now handled by parent) */}
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Ping Pong Champion
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-4 py-6">
          <div className="relative w-32 h-32">
            <Avatar className={`w-full h-full border-4 ${isWinner ? 'border-amber-400' : 'border-red-500'}`}>
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="object-cover w-full h-full rounded-full"
              />
            </Avatar>
            {isWinner && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">{player.name}</h3>
            <p className="text-muted-foreground">
              {isWinner ? "Congratulations! 🎉 You're the champion!" : "Great effort! Ready for another match?"}
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <Button 
            onClick={handleClick}
            className="w-full bg-primary hover:bg-primary/90 transition-colors"
            size="lg"
          >
            Play Again
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
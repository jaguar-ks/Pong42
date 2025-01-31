import { Card } from "@/components/ui/card"

export function ScoreDisplay({ player1Score, player2Score }) {
  return (
    <Card className="relative flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="font-mono text-3xl font-bold tabular-nums">
          <p className="font-mono text-2xl flex">Score:</p>
          {player1Score} : {player2Score}
        </div>

    </Card>
  )
}


'use client'

import { useState } from 'react'
import { PlayerCard } from './components/player-card'
import { ScoreDisplay } from './components/score-display'
import ThreeScene from './components/threeScene'

export default function Game() {
  const [gameState, setGameState] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: null,
    isGameOver: false
  })

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-10  ">
          <PlayerCard
            source="/player.png?height=56&width=56"
            playerName="Player 1"
            playerScore={gameState.player1Score}
            direction="left"
            rank="Pro"
            isActive={!gameState.winner || gameState.winner === 'Player 1'}
          />
          
          <ScoreDisplay
            player1Score={gameState.player1Score}
            player2Score={gameState.player2Score}
            winner={gameState.winner}
            isGameOver={gameState.isGameOver}
          />
          
          <PlayerCard
            source="/player.png?height=56&width=56"
            playerName="Player 2"
            playerScore={gameState.player2Score}
            direction="right"
            rank="Rookie"
            isActive={!gameState.winner || gameState.winner === 'Player 2'}
          />
        </div>

        <div className="rounded-lg border bg-muted overflow-hidden">
          <ThreeScene />
        </div>
      </div>
    </div>
  )
}


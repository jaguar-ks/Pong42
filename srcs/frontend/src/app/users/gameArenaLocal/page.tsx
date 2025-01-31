'use client'

import { useState } from 'react'
import { PlayerCard } from './components/player-card'
import { ScoreDisplay } from './components/score-display'
import ThreeScene from './components/threeScene'

export default function GameComponent({player1, player2, setPage}) {
  const [gameState, setGameState] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: null,
  })

  const handleScoreUpdate = (newScore) => {
    setGameState(prevState => ({
      ...prevState,
      player1Score: newScore.player1,
      player2Score: newScore.player2,
      winner:newScore.winner
    }))
  }

  return (
      <div className="space-y-4">
         <div className="grid grid-cols-3 gap-10">
             <PlayerCard
              playerName={player1}
              playerScore={gameState.player1Score}
              direction="left"
            />
  
            <ScoreDisplay
            player1Score={gameState.player1Score}
            player2Score={gameState.player2Score}
            /> 

          <PlayerCard
            playerName={player2}
            playerScore={gameState.player2Score}
            direction="right"
          />
        </div> 

        <div className="h-full rounded-lg border bg-muted overflow-hidden">
          <ThreeScene onScoreUpdate={handleScoreUpdate} player1={player1} player2={player2} setPage={setPage} />
        </div> 
      </div>
  )
}
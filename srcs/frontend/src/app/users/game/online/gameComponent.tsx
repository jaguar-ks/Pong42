import { useState, useCallback } from 'react'
import { PlayerCard } from './components/player-card'
import { ScoreDisplay } from './components/score-display'
import ThreeScene from './components/threeScene'

export default function GameComponent() {
  const [gameState, setGameState] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: null,
  })

  // Memoize the score update handler with useCallback
  const handleScoreUpdate = useCallback((newScore) => {
    setGameState(prevState => {
      // Only update if scores actually changed
      if (prevState.player1Score === newScore.player1 && 
          prevState.player2Score === newScore.player2) {
        return prevState
      }
      return {
        ...prevState,
        player1Score: newScore.player1,
        player2Score: newScore.player2,
        winner: newScore.winner
      }
    })
  }, []) // Empty dependency array since it only uses setState

  return (
    <div className="flex flex-col justify-center space-y-4 w-full h-full overflow-hidden">
      <div className="grid grid-cols-3 gap-10">
        <PlayerCard direction="left" />
        <ScoreDisplay
          player1Score={gameState.player1Score}
          player2Score={gameState.player2Score}
        />
        <PlayerCard direction="right" />
      </div>
      <div className="h-full w-full flex justify-center items-center rounded-lg border overflow-hidden">
        {/* ThreeScene will now maintain stable prop reference */}
        <ThreeScene onScoreUpdate={handleScoreUpdate} />
      </div>
    </div>
  )
}
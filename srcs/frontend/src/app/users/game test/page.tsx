'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'
import LocalGame from './components/LocalGame'
import OnlineGame from './components/OnlineGame'
import styles from './styles/Game.module.css'
import Image from 'next/image'
import fourPlayers from '../../../../assets/4players_1.svg'
import twoPlayers from '../../../../assets/2players.svg'
import eightPlayers from '../../../../assets/4players_1.svg'
import offlineGame from '../../../../assets/offlineGame.svg'
import onlineGame from '../../../../assets/online.svg'

const GamePage = () => {
  const [gameMode, setGameMode] = useState<'local' | 'online' | null>(null)
  const { updateCurrentPage } = useUserContext()
  const [gameRunning, setGameRunning] = useState(false)
  const [gameType, setGameType] = useState<'single' | 'tournament' | null>(null)
  const [playerCount, setPlayerCount] = useState<2 | 4 | 8>(2)
  const [players, setPlayers] = useState<string[]>(['', ''])

  const router = useRouter()

  React.useEffect(() => {
    updateCurrentPage("game")
  }, [updateCurrentPage])

  const resetGame = () => {
    setGameMode(null)
    setGameRunning(false)
    setGameType(null)
    setPlayerCount(2)
    setPlayers(['', ''])
  }

  return (
    <div className={styles.container}>
      {!gameMode && <h1 className={styles.title}>Choose Your Game Mode</h1>}
      
      {!gameMode && (
        <div className={styles.modeSelection}>
          <button className={styles.imageButton} onClick={() => setGameMode('local')}>
            <Image className={styles.image} src={offlineGame} alt="Local Game" width={200} height={150} />
            <span>Local Game</span>
          </button>
          <button className={styles.imageButton} onClick={() => setGameMode('online')}>
            <Image className={styles.image} src={onlineGame} alt="Online Game" width={200} height={150} />
            <span>Online Game</span>
          </button>
        </div>
      )}

      {gameMode === 'local' && (
        <LocalGame
          gameRunning={gameRunning}
          gameType={gameType}
          playerCount={playerCount}
          players={players}
          setGameRunning={setGameRunning}
          setGameType={setGameType}
          setPlayerCount={setPlayerCount}
          setPlayers={setPlayers}
        />
      )}
      {gameMode === 'online' && (
        <OnlineGame
          gameRunning={gameRunning}
          gameType={gameType}
          playerCount={playerCount}
          players={players}
          setGameRunning={setGameRunning}
          setGameType={setGameType}
          setPlayerCount={setPlayerCount}
          setPlayers={setPlayers}
        />
      )}

      {gameMode && !gameRunning && (
        <div className={styles.backButtonContainer}>
          <button className={styles.button} onClick={resetGame}>
            Back to Mode Selection
          </button>
        </div>
      )}
    </div>
  )
}

export default GamePage


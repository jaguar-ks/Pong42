'use client'

import React, { useState, useEffect } from 'react'
import { useUserContext } from '@/context/UserContext'
import styles from '../styles/Game.module.css'
import Image from 'next/image'
import twoPlayers from '../../../../../assets/2players.svg'
import fourPlayers from '../../../../../assets/4players_1.svg'

interface OnlineGameProps {
  gameRunning: boolean
  gameType: 'single' | 'tournament' | null
  playerCount: 2 | 4 | 8
  players: string[]
  setGameRunning: (running: boolean) => void
  setGameType: (type: 'single' | 'tournament' | null) => void
  setPlayerCount: (count: 2 | 4 | 8) => void
  setPlayers: (players: string[]) => void
}

const OnlineGame: React.FC<OnlineGameProps> = ({
  gameRunning,
  gameType,
  playerCount,
  players,
  setGameRunning,
  setGameType,
  setPlayerCount,
  setPlayers,
}) => {
  const { userData } = useUserContext()
  const [waitingPlayers, setWaitingPlayers] = useState<any[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    if (gameType === 'single') {
      setPlayerCount(2)
    }
  }, [gameType, setPlayerCount])

  useEffect(() => {
    if (gameType && !gameRunning) {
      const interval = setInterval(() => {
        if (waitingPlayers.length < playerCount - 1) {
          setWaitingPlayers(prev => [...prev, { id: Date.now(), name: `Player ${prev.length + 2}` }])
        } else {
          clearInterval(interval)
          setGameRunning(true)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [gameType, playerCount, gameRunning, setGameRunning])

  const handleStartGame = () => {
    console.log('Starting online game with:', { gameType, playerCount, waitingPlayers })
    setGameRunning(true)
  }

  const handleSetWinner = (player: string) => {
    setWinner(player)
    if (gameType === 'tournament') {
      setCurrentRound(prev => prev + 1)
    } else {
      // End the game for single matches
      console.log(`Game ended. Winner: ${player}`)
    }
  }

  const renderGameView = () => {
    return (
      <div className={styles.gameView}>
        <h3 className={styles.subtitle}>Game View</h3>
        <p>Current Round: {currentRound}</p>
        <div className={styles.playerInfo}>
          <div>
            <strong>Player 1:</strong> {userData?.username}
            {userData?.avatar_url && <img src={userData.avatar_url} alt={userData?.username} className={styles.avatarImage} />}
          </div>
          {waitingPlayers.map((player, index) => (
            <div key={player.id}>
              <strong>Player {index + 2}:</strong> {player.name}
            </div>
          ))}
        </div>
        {gameType === 'tournament' && (
          <div className={styles.tournamentMap}>
            <p>Tournament Bracket</p>
            <div className={styles.bracket}>
              <div className={styles.round}>
                {[userData, ...waitingPlayers].slice(0, playerCount).map((player, index) => (
                  index % 2 === 0 && (
                    <div key={index} className={styles.match}>
                      {player.username || player.name} vs {(waitingPlayers[index] || {}).name || 'TBD'}
                    </div>
                  )
                ))}
              </div>
              <div className={styles.round}>
                <div className={styles.match}>Final Match</div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.winnerButtons}>
          <button className={styles.button} onClick={() => handleSetWinner(userData?.username || 'Player 1')}>
            Set {userData?.username || 'Player 1'} as Winner
          </button>
          <button className={styles.button} onClick={() => handleSetWinner(waitingPlayers[0]?.name || 'Player 2')}>
            Set {waitingPlayers[0]?.name || 'Player 2'} as Winner
          </button>
        </div>
        {winner && <p className={styles.winnerAnnouncement}>Winner of this round: {winner}</p>}
      </div>
    )
  }

  return (
    <div className={styles.gameSetup}>
      <h2 className={styles.subtitle}>Online Game Setup</h2>

      {!gameType && (
        <div className={styles.gameTypeSelection}>
          <button className={styles.imageButton} onClick={() => setGameType('single')}>
            <Image className={styles.image} src={twoPlayers} alt="1 V 1" width={200} height={150} />
            <span>1 V 1</span>
          </button>
          <button className={styles.imageButton} onClick={() => setGameType('tournament')}>
            <Image className={styles.image} src={fourPlayers} alt="Tournament" width={200} height={150} />
            <span>Tournament</span>
          </button>
        </div>
      )}

      {gameType && !gameRunning && (
        <div className={styles.fadeIn}>
          {/* <div className={styles.playerItem}>
            <div className={styles.avatar}>
              {userData?.avatar_url ? (
                <img src={userData.avatar_url} alt={userData?.username} className={styles.avatarImage} />
              ) : (
                <span className={styles.avatarFallback}>{userData?.username?.charAt(0)}</span>
              )}
            </div>
            <div className={styles.playerInfo}>
              <p className={styles.playerName}>{userData?.username}</p>
              <p className={styles.playerRating}>Rating: {userData?.rating}</p>
            </div>
          </div> */}

          {gameType === 'tournament' && (
            <div className={styles.formGroup}>
              <p className={styles.label}>Number of Players</p>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="playerCount"
                    value="4"
                    checked={playerCount === 4}
                    onChange={() => setPlayerCount(4)}
                  />
                  4 Players
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="playerCount"
                    value="8"
                    checked={playerCount === 8}
                    onChange={() => setPlayerCount(8)}
                  />
                  8 Players
                </label>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            {/* <h3 className={styles.subtitle}>Waiting for Players...</h3> */}
            <div className={styles.playerList}>
              {[...Array(playerCount)].map((_, index) => (
                <>
                  <div key={index} className={`${styles.playerItem} ${styles.pulseAnimation}`}>
                    <div className={styles.avatar}>
                      {index === 0 && userData?.avatar_url ? (
                        <img src={userData.avatar_url} alt={userData?.username} className={styles.avatarImage} />
                      ) : (
                        <span className={styles.avatarFallback}>
                          {index === 0 ? userData?.username?.charAt(0) : '?'}
                        </span>
                      )}
                    </div>
                    <p className={styles.playerName}>
                      {index === 0 ? userData?.username : waitingPlayers[index - 1]?.name || 'Waiting...'}
                    </p>
                  </div>
                  vs
                </>
              ))}
            </div>
          </div>

          <button 
            className={styles.button} 
            onClick={handleStartGame} 
            disabled={waitingPlayers.length < playerCount - 1}
          >
            {waitingPlayers.length < playerCount - 1 ? 'Waiting for Players...' : 'Start Game'}
          </button>
        </div>
      )}

      {gameRunning && renderGameView()}

      {gameType && !gameRunning && (
        <div className={styles.backButtonContainer}>
          <button className={styles.button} onClick={() => {
            setGameType(null)
            setWaitingPlayers([])
          }}>
            Back to Game Type Selection
          </button>
        </div>
      )}
    </div>
  )
}

export default OnlineGame


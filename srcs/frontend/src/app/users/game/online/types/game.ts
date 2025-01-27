export interface GameState {
  player1Score: number
  player2Score: number
  winner: string | null
}

export interface PlayerInfoProps {
  playerName: string
  playerScore: number
  direction: 'left' | 'right'
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface PaddlePosition {
  x: number
  y: number
  z: number
}


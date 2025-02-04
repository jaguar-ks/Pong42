import Image from 'next/image'

interface PlayerCardProps {
  source: string
  playerName: string
  playerScore: number
  direction: 'left' | 'right'
  rank?: string
  isActive?: boolean
}

export function PlayerCard({
  source,
  playerName,
  playerScore,
  direction,
  rank,
  isActive = true,
}: PlayerCardProps) {
  return (
    <div className={`flex items-center ${direction === 'right' ? 'justify-end' : ''}`}>
      <div className={`flex items-center ${direction === 'right' ? 'flex-row-reverse' : ''} gap-4`}>
        <div className="relative">
          <Image
            src={source || "/placeholder.svg"}
            alt={`${playerName}'s avatar`}
            width={56}
            height={56}
            className={`rounded-full ${isActive ? 'border-4 border-green-500' : 'border-4 border-gray-300'}`}
          />
          {rank && (
            <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {rank}
            </span>
          )}
        </div>
        <div className={`text-${direction === 'right' ? 'right' : 'left'}`}>
          <h2 className="text-xl font-bold">{playerName}</h2>
          <p className="text-sm text-gray-500">Score: {playerScore}</p>
        </div>
      </div>
    </div>
  )
}


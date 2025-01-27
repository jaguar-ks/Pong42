'use client';
import Game from '@/app/users/gameArena/page';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface GameSocketContextType {
  move: (direction: string, playerId: number) => void;
  close: () => void;
  isConnected: boolean;
  myPaddel: Paddel;
  setMyPaddel: React.Dispatch<React.SetStateAction<Paddel>>;
  oppPaddel: Paddel;
  setOppPaddel: React.Dispatch<React.SetStateAction<Paddel>>;
}

interface Paddel { 
  x: number;
  y: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
}

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [myPaddel, setMyPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [oppPaddel, setOppPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/game/`;
    if (!ws.current) {
      ws.current = new WebSocket(wsUrl);
    }

    ws.current.onopen = () => {
      console.log('game state started');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // if (message.type === 'game') {
      //   // Update game state based on the received message
      //   setGameState((prevState) => ({
      //     ...prevState,
      //     player1Score: message.player1Score,
      //     player2Score: message.player2Score,
      //     winner: message.winner,
      //     isGameOver: message.isGameOver
      //   }));
      // }
    };
    
    ws.current.onclose = () => {
      console.log('Disconnected from game');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const move = (direction:any, playerId:any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify('move', playerId, direction));
    }
  };

  const close = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  return (
    <GameSocketContext.Provider value={{myPaddel, setMyPaddel, oppPaddel,setOppPaddel, move, close, isConnected }}>
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

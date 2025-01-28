'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface GameSocketContextType {
  move: (direction: string)=>void;
  isConnected: boolean;
  myPaddel: Paddel;
  oppPaddel: Paddel;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  ball: Ball;
  stageReady: boolean;
  setStage: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [myPaddel, setMyPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [oppPaddel, setOppPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const myId = useRef<number>(0);
  const oppId = useRef<number>(0);
  const [stageReady, setStage] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const wsUrl = `ws://localhost:8000/ws/game/`;
      if (!ws.current) {
        ws.current = new WebSocket(wsUrl);
      }

      ws.current.onopen = () => {
        console.log('Game state started');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'game.start') {
          myId.current = data.data.my_id;
          oppId.current = data.data.opp_id;
        }

        if (data.type === 'game.update') {
          setStage(true);
          setMyPaddel({x:data.data[myId.current].x, y:data.data[myId.current].y, score: data.data[myId.current].score});
          setOppPaddel({x:data.data[oppId.current].x, y:data.data[oppId.current].y, score: data.data[oppId.current].score});
          setBall({x:data.data.ball.x, y:data.data.ball.y});
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from game');
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }, [gameStarted]);

  const move = (direction: string, playerId: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'move', direction }));
    }
  };

  const close = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  return (
    <GameSocketContext.Provider value={{ stageReady, setStage ,gameStarted, setGameStarted, myPaddel, oppPaddel,myId, oppId, move, ball }}>
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error('useGameSocket must be used within a GameSocketProvider');
  }
  return context;
};

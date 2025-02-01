'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUserContext } from './UserContext';

interface GameSocketContextType {
  move: (direction: string) => void;
  isConnected: boolean;
  myPaddel: Paddel;
  oppPaddel: Paddel;
  gameStarted: boolean;
  me: PlayerData;
  opp: PlayerData;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  ball: Ball;
  stageReady: boolean;
  setStage: React.Dispatch<React.SetStateAction<boolean>>;
  disconnectSocket: () => void;
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

interface PlayerData {
  id: number;
  username: string;
  avatar: string;
}

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [myPaddel, setMyPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [oppPaddel, setOppPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [stageReady, setStage] = useState(false);
  const opp = useRef<PlayerData>({ id: 0, username: '', avatar: '' });
  const { userData } = useUserContext();
  const me = { id: userData.id | 0, username: userData.username, avatar: userData.avatar_url | '' }

  useEffect(() => {
    if (gameStarted) {
      const wsUrl = `ws://localhost:8000/ws/game/`;
      if (!ws.current) {
        ws.current = new WebSocket(wsUrl);
      }

      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'game.start':
            const op = data.data.participants.find((p) => p.id !== userData.id);
            opp.current = {
              id: op.id,
              username: op.username,
              avatar: op.avatar_url,
            };
            break;
          case 'game.update':
            setStage(true);
            setMyPaddel({
              x: data.data[me.id].x,
              y: data.data[me.id].y,
              score: data.data[me.id].score,
            });
            setOppPaddel({
              x: data.data[opp.current.id].x,
              y: data.data[opp.current.id].y,
              score: data.data[opp.current.id].score,
            });
            setBall({ x: data.data.ball.x, y: data.data.ball.y });
            break;
          default:
            console.warn('Unhandled message type:', data.type);
        }
      };

      ws.current.onopen = () => {
        console.log('Game state started');
      };

      ws.current.onmessage = handleMessage;

      ws.current.onclose = () => {
        console.log('Disconnected from game');
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        if (ws.current) {
          ws.current.close();
          ws.current = null;
        }
      };
    }
  }, [gameStarted, userData]);

  const disconnectSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const move = (direction: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'move', direction }));
    }
  };

  return (
    <GameSocketContext.Provider
      value={{
        stageReady,
        setStage,
        gameStarted,
        setGameStarted,
        myPaddel,
        oppPaddel,
        me: me,
        opp: opp.current,
        move,
        ball,
        disconnectSocket,
      }}
    >
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
'use client';
import { Avatar } from '@/components/ui/avatar';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUserContext } from './UserContext';

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
  // const me = useRef<number>(0);
  // const opp = useRef<number>(0);
  const [stageReady, setStage] = useState(false);
  const me = useRef<PlayerData>({ id: 0, username: '', avatar: '' });
  const opp = useRef<PlayerData>({ id: 0, username: '', avatar: '' });
  const { userData } = useUserContext();

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
        if (data.type === 'room.waiting') {
          console.log(data);
          me.current.id = data.data.participants[0].id;
          me.current.username = data.data.participants[0].username;
          me.current.avatar = data.data.participants[0].avatar_url;
        }
        if (data.type === 'game.start') {
          console.log(data);
          const op = data.data.participants.find((p: any) => p.id !== userData.id);
          opp.current.id = op.id;
          opp.current.username = op.username;
          opp.current.avatar = op.avatar_url;
          me.current.id = userData.id;
          me.current.username = userData.username;
          me.current.avatar = userData.avatar_url;
          // me.current = data.data.my_id;
          // opp.current = data.data.opp_id;
        }

        if (data.type === 'game.update') {
          setStage(true);
          setMyPaddel({x:data.data[me.current.id].x, y:data.data[me.current.id].y, score: data.data[me.current.id].score});
          setOppPaddel({x:data.data[opp.current.id].x, y:data.data[opp.current.id].y, score: data.data[opp.current.id].score});
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
    <GameSocketContext.Provider value={{ stageReady, setStage ,gameStarted, setGameStarted, myPaddel, oppPaddel,me, opp, move, ball }}>
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

'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './UserContext';

interface Message {
  message: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
}

type Notifications = {
  id: number;
  user: number;
  notification_type: string;
  message: string;
  created_at: string;
  read: boolean;
  sender: string | null;
  connection_id: number | null;
}

interface WebSocketContextType {
  close: () => void;
  sendMessage: (recipientId: number, message: string) => void;
  messages: Message[];
  isConnected: boolean;
  clearMessages: () => void;
  notification: boolean;
  setNotification: React.Dispatch<React.SetStateAction<boolean>>;
  onlineUser: { user_id: number; is_online: boolean };
  connectionUpdate: boolean;
  setConnectionUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { userData } = useContext(UserContext);
  const [notification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [onlineUser, setOnlineUser] = useState<{ user_id: number; is_online: boolean }>({ user_id: 0, is_online: false });
  const [connectionUpdate, setConnectionUpdate] = useState(false);
  const userDataRef = useRef(userData);
  const reconnectInterval = useRef<NodeJS.Timeout>();
  const messageQueue = useRef<Array<() => void>>([]);
  const keepAliveInterval = useRef<NodeJS.Timeout>();
  const [retryCount, setRetryCount] = useState(0);

  const connect = () => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/chat/`;
    
    if (ws.current && [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.current.readyState)) {
      return;
    }

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to chat');
      setIsConnected(true);
      setRetryCount(0);
      messageQueue.current.forEach(send => send());
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      try {
        const message = typeof event.data === 'string' 
          ? JSON.parse(event.data)
          : event.data;

        if (message.type === 'message') {
          setMessages(prev => {
            const messageExists = prev.some(
              msg => 
                msg.message === message.message && 
                msg.timestamp === message.timestamp &&
                msg.sender_id === message.sender_id
            );
            return messageExists ? prev : [...prev, message];
          });
        }

        if (message.type === 'notification') {
          setNotifications(prev => {
            const notificationExists = prev.some(
              notif =>
                notif.message === message.message &&
                notif.created_at === message.created_at &&
                notif.user === message.user
            );
            return notificationExists ? prev : [...prev, message];
          });
          console.log('Notification:', notifications, message);
          setNotification(true);
          
          if (message.notification_type === 'Connections' && 
              !connectionUpdate && 
              (message.user === userDataRef.current?.id)) {
            setConnectionUpdate(true);
          }
        }

        if (message.type === 'online') {
          const { user_id, is_online } = message;
          setOnlineUser({ user_id, is_online });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from chat');
      setIsConnected(false);
      const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
      reconnectInterval.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        connect();
      }, timeout);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
      }
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      keepAliveInterval.current = setInterval(() => {
        ws.current?.send(JSON.stringify({ type: 'ping' }));
      }, 30000);
    }
    return () => {
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, [isConnected]);

  const close = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const sendMessage = (recipientId: number, message: string) => {
    const sendFn = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          recipient_id: recipientId,
          message: message,
          type: 'message',
        }));
      }
    };

    if (isConnected) {
      sendFn();
    } else {
      messageQueue.current.push(sendFn);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <WebSocketContext.Provider value={{
      close,
      sendMessage,
      messages,
      isConnected,
      clearMessages,
      notification,
      setNotification,
      onlineUser,
      connectionUpdate,
      setConnectionUpdate
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
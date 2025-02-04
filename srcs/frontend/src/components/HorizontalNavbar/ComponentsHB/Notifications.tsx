'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './Notifications.module.css';
import axios from 'axios';
import { useWebSocket } from '@/context/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/context/GameSocketContext';
import { useUserContext } from '@/context/UserContext';

type Notification = {
  id: number;
  user: number;
  notification_type: string;
  message: string;
  created_at: string;
  read: boolean;
  sender: string | null;
  connection_id: number | null;
  clicked: boolean | false;
}

// Optimized time formatting
const formatNotificationTime = (isoString: string): string => {
  const [datePart, timePart] = isoString.split('T');
  const [hours, minutes] = timePart.split(':');
  return `${datePart} | ${hours}:${minutes}`;
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { notification: wsNotification, messages: wsMessages } = useWebSocket(); // Removed wsMessages if unused
  const router = useRouter();
  const { setGameStarted, setRoom } = useGameSocket();
  const { userData } = useUserContext();

  const fetchNotifications = async () => {
    try {
      await axios.get<{ results: Notification[] }>(
        'http://localhost:8000/api/users/me/notifications/',
        { withCredentials: true }
      ).then((res) => {
        setNotifications(res.data.results);
      });
      notifications.forEach((notif) => {
        if (notif.notification_type === 'Connections' && !notif.connection_id && !notif.sender) {
          updateNotificationState(notif.id, { clicked: true });
        }
        if (notif.notification_type === 'Game' && !notif.sender) {
          updateNotificationState(notif.id, { clicked: true });
        }
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [wsNotification, wsMessages]); // Removed wsMessages from dependencies if not needed

  const updateNotificationState = (notificationId: number, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, ...updates } : notif,
    ));
  };

  const handleFriendRequest = async (
    action: 'accept' | 'reject',
    connectionId: number | null,
    notificationId: number
  ) => {
    if (!connectionId) return;

    try {
      // Optimized API call handling
      const request = action === 'accept' 
        ? axios.get(`http://localhost:8000/api/users/me/connections/${connectionId}/accept/`, { withCredentials: true })
        : axios.delete(`http://localhost:8000/api/users/me/connections/${connectionId}/`, { withCredentials: true });

      updateNotificationState(notificationId, { clicked: true });
      
      await request;
      console.log(`Friend request ${action}ed successfully`);
      
      // Refresh notifications after successful action
      await fetchNotifications();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  const handleGameChallenge = async (
    sender: string | null,
    notificationId: number
  ) => {
    if (!sender) return;

    try {
      setGameStarted(true);
      setRoom(`${sender}*${userData.username}`);
      router.push(`/users/game/online/`);

      updateNotificationState(notificationId, { clicked: true });
      
      // Refresh notifications after successful action
      await fetchNotifications();
    } catch (error) {
      console.error(`Error acceptinging friend request:`, error);
    }
  };

  return (
    <div className={styles.dropdownContent}>
      <h3 className={styles.dropdownTitle}>Notifications</h3>
      {notifications.map((notification) => (
        <div key={notification.id} className={styles.notificationItem}>
          <div className={styles.notificationText}>
            <p className={styles.notificationMessage}>{notification.message}</p>
            <span className={styles.notificationTime}>
              {formatNotificationTime(notification.created_at)}
            </span>
          </div>
          
          {notification.notification_type === 'Connections' &&
          notification.message.includes('sent you a friend request') &&
          !notification.clicked && (
            <div className={styles.buttonsContainer}>
              <button
                className={styles.acceptButton}
                onClick={() => handleFriendRequest('accept', notification.connection_id, notification.id)}
              >
                Accept
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleFriendRequest('reject', notification.connection_id, notification.id)}
              >
                Reject
              </button>
            </div>
          )}
          {notification.notification_type === 'Game' &&
          notification.message.includes('is challenging you to a game') &&
          !notification.clicked && (
            <div className={styles.buttonsContainer}>
              <button
                className={styles.acceptButton}
                onClick={() => handleGameChallenge(notification.sender, notification.id)}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
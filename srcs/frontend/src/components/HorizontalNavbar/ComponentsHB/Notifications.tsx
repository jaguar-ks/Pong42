'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import classes from './Notifications.module.css';
import axios from 'axios';
import { useWebSocket } from '@/context/WebSocketContext';

type Notifications ={
  id: number,
  user: number,
  notification_type: string,
  message: string,
  created_at: string,
  read: boolean,
}

function printTime(time: string){
  let str = time.split('T')[1];
  str = time.split('T')[0] + ' | ' + str.split(':')[0] + ':' + str.split(':')[1];
  return str;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { messages: wsMessages, notification} = useWebSocket();

  useEffect(() => {
    if (wsMessages.length > 0) {
      console.log('Received message from WebSocket:', wsMessages);
    }
    axios.get(`http://localhost:8000/api/users/me/notifications/`, {withCredentials: true})
    .then((res) => {
        setNotifications(res.data.results)
        console.log(res.data.results)
    })
  },[notification, wsMessages])
  return (
    <div className={classes.dropdownContent}>
      <h3 className={classes.dropdownTitle}>Notifications</h3>
      {notifications.map((notification) => (
        <div key={notification.id} className={classes.notificationItem}>
          <div className={classes.notificationText}>
            <p className={classes.notificationMessage}>{notification.message}</p>
            <span className={classes.notificationTime}>{printTime(notification.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;

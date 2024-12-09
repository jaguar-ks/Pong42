import React from 'react';
import Image from 'next/image';
import classes from './Notifications.module.css';

interface Notification {
  id: number;
  image: string;
  message: string;
  time: string;
}

const notifications: Notification[] = [
  { id: 1, image: '/match-notification.png', message: 'New match available', time: '2 min ago' },
  { id: 2, image: '/friend-request.png', message: 'New friend request', time: '5 min ago' },
];

const Notifications: React.FC = () => {
  return (
    <div className={classes.dropdownContent}>
      <h3 className={classes.dropdownTitle}>Notifications</h3>
      {notifications.map((notification) => (
        <div key={notification.id} className={classes.notificationItem}>
          <Image src={notification.image} alt="Notification" width={40} height={40} className={classes.notificationImage} />
          <div className={classes.notificationText}>
            <p className={classes.notificationMessage}>{notification.message}</p>
            <span className={classes.notificationTime}>{notification.time}</span>
          </div>
        </div>
      ))}
      <button className={classes.viewAllButton}>View All Notifications</button>
    </div>
  );
};

export default Notifications;


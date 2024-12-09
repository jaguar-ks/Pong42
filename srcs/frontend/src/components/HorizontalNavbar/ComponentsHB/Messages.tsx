import React from 'react';
import Image from 'next/image';
import classes from './Messages.module.css';

interface Message {
  id: number;
  senderName: string;
  senderImage: string;
  message: string;
  time: string;
}

const messages: Message[] = [
  { id: 1, senderName: 'John Doe', senderImage: '/user1.png', message: 'Hey, how are you?', time: '2 min ago' },
  { id: 2, senderName: 'Jane Smith', senderImage: '/user2.png', message: 'Good game!', time: '5 min ago' },
];

const Messages: React.FC = () => {
  return (
    <div className={classes.dropdownContent}>
      <h3 className={classes.dropdownTitle}>Messages</h3>
      {messages.map((message) => (
        <div key={message.id} className={classes.messageItem}>
          <Image src={message.senderImage} alt={message.senderName} width={40} height={40} className={classes.messageImage} />
          <div className={classes.messageText}>
            <p className={classes.messageSender}>{message.senderName}</p>
            <p className={classes.messageContent}>{message.message}</p>
            <span className={classes.messageTime}>{message.time}</span>
          </div>
        </div>
      ))}
      <button className={classes.viewAllButton}>View All Messages</button>
    </div>
  );
};

export default Messages;


"use client"
import React from 'react'
import Image from 'next/image'
import styles from './Friends.module.css'

const buttons = [
  { name: "Send Request", action: () => console.log("Sending friend request"), icon: "/icons/send-request.png" },
  { name: "Send Message", action: () => console.log("Sending message"), icon: "/icons/send-message.png" },
  { name: "Challenge", action: () => console.log("Sending game challenge"), icon: "/icons/challenge.png" },
  { name: "Block", action: () => console.log("Blocking user"), icon: "/icons/block.png" }
];

const FriendsFR = () => {
  return (
    <div className={styles.friends}>
      {buttons.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={styles.button}
        >
          <div className={styles.iconWrapper}>
            <Image
              src={item.icon}
              alt={item.name}
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FriendsFR;


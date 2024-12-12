import React from "react";
import Image from "next/image";
import { UserConnection } from "../types";
import styles from "../friends.module.css";
import TestImage from "../../../assets/player.png";

interface FriendsListProps {
  friends: UserConnection[];
  onBlock: (id: number) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onBlock }) => (
  <div>
    {friends.map((friend) => (
      <div className={styles.item} key={friend.id}>
        <Image
          src={friend.user.avatar_url || TestImage}
          alt={friend.user.username}
          width={50}
          height={50}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3 className={styles.name}>{friend.user.username}</h3>
          <p className={styles.message}>Friends</p>
          <div className={styles.actionButtons}>
            <button className={`${styles.actionButton} ${styles.challengeButton}`}>Challenge</button>
            <button className={`${styles.actionButton} ${styles.messageButton}`}>Message</button>
            <button className={`${styles.actionButton} ${styles.blockButton}`} onClick={() => onBlock(friend.user.id)}>Block</button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FriendsList;


import React from "react";
import Image from "next/image";
import { UserConnection } from "../types";
import styles from "../friends.module.css";
import TestImage from "../../../assets/player.png";

interface BlockedListProps {
  blocked: UserConnection[];
  onUnblock: (id: number) => void;
}

const BlockedList: React.FC<BlockedListProps> = ({ blocked, onUnblock }) => (
  <div>
    {blocked.map((item) => (
      <div className={styles.item} key={item.id}>
        <Image
          src={item.user.avatar_url || TestImage}
          alt={item.user.username}
          width={50}
          height={50}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3 className={styles.name}>{item.user.username}</h3>
          <p className={styles.message}>Blocked user</p>
          <button
            className={`${styles.actionButton} ${styles.unblockButton}`}
            onClick={() => onUnblock(item.id)}
          >
            Unblock
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default BlockedList;


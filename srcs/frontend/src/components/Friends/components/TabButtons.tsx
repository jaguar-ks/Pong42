import React from "react";
import Image from "next/image";
import { UserConnection } from "../types";
import styles from "../friends.module.css";
import TestImage from "../../../assets/player.png";

interface RequestListProps {
  requests: UserConnection[];
  onAccept: (id: number) => void;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onAccept }) => (
  <div>
    {requests.map((item) => (
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
          <p className={styles.message}>Friend request from {item.user.username}</p>
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={() => onAccept(item.id)}
          >
            Accept
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default RequestList;


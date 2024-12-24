"use client";

import React from "react";
import Image from "next/image";
import styles from "./playerInfos.module.css";
import TimeDifference from "../TimeDifference/TimeDifference";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import { useUserContext } from "@/context/UserContext";

// Helper function to truncate text
const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return "Loading...";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// Component to display a single info item
const InfoItem: React.FC<{ title: string; value: string | undefined }> = ({ title, value }) => (
  <div className={styles.info}>
    <h2 className={styles.title}>{title}:</h2>
    <div className={styles.infoAndCopy}>
      <h2 className={styles.value}>{truncateText(value, 20)}</h2>
      <CopyToClipboard textToCopy={value || ""} width={18} height={18} />
    </div>
  </div>
);

// Main PlayerInfos component
const PlayerInfos: React.FC<{ user: string }> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext();
  const data = user === "search" ? userDataSearch : userData;

  const defaultAvatarUrl = "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png";

  return (
    <div className={styles.playerinfos}>
      {/* User Image and Name Section */}
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={data.avatar_url || defaultAvatarUrl}
            alt="Avatar"
            width={100}
            height={100}
          />
          {data.is_online && (
            <div className={`${styles.statusDot} ${data.is_online ? styles.online : styles.offline}`} />
          )}
        </div>
        <div className={styles.nameUnderImage}>
          {truncateText(`${data.first_name} ${data.last_name}`, 20)}
        </div>
        {!data.is_online && data.last_login && (
          <div className={styles.lastSeen}>
            Last seen: <TimeDifference timestamp={data.last_login} />
          </div>
        )}
      </div>

      {/* User Info Section */}
      <div className={styles.infosContainer}>
        <InfoItem title="Username" value={data.username} />
        <InfoItem title="ID" value={data.id?.toString()} />
        {user !== "search" && <InfoItem title="Email" value={data.email} />}
      </div>
    </div>
  );
};

export default PlayerInfos;


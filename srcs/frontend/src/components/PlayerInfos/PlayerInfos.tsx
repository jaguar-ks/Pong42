"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./playerInfos.module.css";
import TimeDifference from "../TimeDifference/TimeDifference";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import { useUserContext } from "@/context/UserContext";
import { useWebSocket } from "@/context/WebSocketContext";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const dt = user === "search" ? userDataSearch : userData;
  const { onlineUser } = useWebSocket();
  const data = dt.id === onlineUser.user_id ? {...dt, is_online: onlineUser.is_online} : dt;
  console.log("onlineUser", onlineUser);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await axios.get("http://localhost:8000/api/auth/test_auth/",{withCredentials: true})
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } finally{
      }
    }
    checkToken();
  }, [])


  const defaultAvatarUrl = "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png";

  // Type guard to check if the data is of type UserDataType
  const isUserDataType = (data: typeof userData | typeof userDataSearch): data is typeof userData =>
    "last_login" in data;

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
        {/* Only show last login if data is of UserDataType */}
        {!data.is_online && isUserDataType(data) && data.last_login && (
          <div className={styles.lastSeen}>
            Last seen: <TimeDifference timestamp={data.last_login} />
          </div>
        )}
      </div>

      {/* User Info Section */}
      <div className={styles.infosContainer}>
        <InfoItem title="Username" value={data.username} />
        <InfoItem title="ID" value={data.id?.toString()} />
        {user !== "search" && "email" in data && <InfoItem title="Email" value={data.email} />}
      </div>
    </div>
  );
};

export default PlayerInfos;

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./playerInfos.module.css";
import TimeDifference from "../TimeDifference/TimeDifference";
import { useUserContext } from "@/context/UserContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { useRouter } from "next/navigation";
import Api from "@/lib/api";

const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return "Loading...";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const InfoItem: React.FC<{ title: string; value: string | undefined }> = ({ title, value }) => (
  <div className={styles.info}>
    <h2 className={styles.title}>{title}:</h2>
    <div className={styles.infoAndCopy}>
      <h2 className={styles.value}>{truncateText(value, 20)}</h2>
    </div>
  </div>
);



const PlayerInfos: React.FC<{ user: string }> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext();
  const dt = user === "search" ? userDataSearch : userData;
  const { onlineUser } = useWebSocket();
  const data = dt.id === onlineUser.user_id ? {...dt, is_online: onlineUser.is_online} : dt;
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await Api.get("/auth/test_auth/",{withCredentials: true})
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } finally{
      }
    }
    checkToken();
  }, [])


  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR;

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

"use client";

import React from "react";
import classes from "./playerInfos.module.css";
import TimeDifference from "../TimeDifference/TimeDifference";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";

const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return "Loading...";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const PlayerInfos: React.FC<{ user: string }> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext();
  const data = user === "search" ? userDataSearch : userData;

  return (
    <div className={classes.playerinfos}>
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          <Image
            className={classes.image}
            src={
              data.avatar_url ||
              "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"
            }
            alt="Avatar"
            width={100}
            height={100}
          />
          <div className={`${classes.statusDot} ${data.is_online ? classes.online : classes.offline}`}></div>
        </div>
        <div className={classes.nameUnderImage}>
          {truncateText(`${data.first_name} ${data.last_name}`, 20)}
        </div>
        {!data.is_online && data.last_login && (
          <div className={classes.lastSeen}>
            Last seen: <TimeDifference timestamp={data.last_login} />
          </div>
        )}
      </div>
      <div className={classes.infosContainer}>
        <div className={classes.info}>
          <h2 className={classes.title}>Username:</h2>
          <div className={classes.infoAndCopy}>
            <h2 className={classes.title}>
              {truncateText(data.username, 10)}
            </h2>
            <CopyToClipboard textToCopy={data.username || ""} width={18} height={18} />
          </div>
        </div>
        <div className={classes.info}>
          <h2 className={classes.title}>ID:</h2>
          <div className={classes.infoAndCopy}>
            <h2 className={classes.title}>
              {truncateText(data.id?.toString(), 10)}
            </h2>
            <CopyToClipboard textToCopy={data.id?.toString() || ""} width={18} height={18} />
          </div>
        </div>
        { user !== "search" && <div className={classes.info}>
          <h2 className={classes.title}>Email:</h2>
          <div className={classes.infoAndCopy}>
            <h2 className={classes.title}>
              {truncateText(data.email, 10)}
            </h2>
            <CopyToClipboard textToCopy={data.email || ""} width={18} height={18} />
          </div>
        </div>}
      </div>
    </div>
  );
};

export default PlayerInfos;


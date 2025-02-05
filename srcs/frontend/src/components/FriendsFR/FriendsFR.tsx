"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./friends.module.css";
import sendMsgIcon from "../../../assets/send message.svg";
import addFriendIcon from "../../../assets/add-friendBlack.svg";
import challengeIcon from "../../../assets/challengeBlack.svg";
import blockFriendIcon from "../../../assets/blockFriend.svg";
import { useUserContext } from "@/context/UserContext";
import { useGameSocket } from "@/context/GameSocketContext";
import { useRouter } from "next/navigation";
import Api from "@/lib/api";

type FriendsFRProps = {
  id: number;
};



const FriendsFR: React.FC<FriendsFRProps> = ({ id }) => {
  const { searchedUserData, updateSearchedUserData, userData } = useUserContext();
  const { setGameStarted, setRoom } = useGameSocket();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const sendFriendRequest = async () => {
    try {
      const response = await Api.post(
        `/users/me/connections/`,
        { recipient_id: id },
        { withCredentials: true }
      );
      console.log("Friend request sent:", response.data);
      updateSearchedUserData({
        ...searchedUserData,
        connection: {
          ...(searchedUserData?.connection || {id: response.data.id}),
          status: "sent_request",
        },
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const cancelFriendRequest = async () => {
    setShowPopup(true);
  };

  const confirmCancelRequest = async () => {
    try {
      await Api.delete(
        `/users/me/connections/${searchedUserData.connection?.id}/`,
        { withCredentials: true }
      );
      console.log("Friend request cancelled");
      updateSearchedUserData({
        ...searchedUserData,
        connection: {
          ...(searchedUserData?.connection || {id: 0}),
          status: "",
        },
      });
    } catch (error) {
      console.error("Error cancelling friend request:", error);
    }
    setShowPopup(false);
  };

  const sendMessage = () => {
    console.log("Sending message");
  };

  const sendChallenge = () => {
    setGameStarted(true);
    setRoom(`${userData.username}_${searchedUserData.username}`);
    router.push('/users/game/online');
    console.log("Sending game challenge");
  };

  const blockUser = async () => {
    try {
      const response = await Api.post(
        `/users/me/connections/block/`,
        { recipient_id: id },
        { withCredentials: true }
      );
      console.log("User blocked:", response.data);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  return (
    <div className={styles.friends}>
      <div className={styles.buttonWrapper}>
        <button
          onClick={
            searchedUserData?.connection?.status === "sent_request"
              ? cancelFriendRequest
              : sendFriendRequest
          }
          className={styles.button}
        >
          <div className={styles.iconWrapper}>
            <Image
              src={addFriendIcon}
              alt="Send Request"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>
            {searchedUserData?.connection?.status === "sent_request"
              ? "Cancel Request"
              : searchedUserData?.connection?.status === "friends"
              ? "Friends"
              : "Send Request"}
          </span>
        </button>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={sendMessage} className={styles.button} disabled={searchedUserData?.connection?.status !== "friends"}>
          <div className={styles.iconWrapper}>
            <Image
              src={sendMsgIcon}
              alt="Send Message"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>Send Message</span>
        </button>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={sendChallenge} className={styles.button}>
          <div className={styles.iconWrapper} onClick={sendChallenge} disabled={searchedUserData?.connection?.status !== "friends"}>
            <Image
              src={challengeIcon}
              alt="Challenge"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>Challenge</span>
        </button>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={blockUser} className={styles.button}>
          <div className={styles.iconWrapper}>
            <Image
              src={blockFriendIcon}
              alt="Block"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>Block</span>
        </button>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <p>Are you sure you want to cancel the friend request?</p>
          <div className={styles.popupButtons}>
            <button
              onClick={confirmCancelRequest}
              className={styles.popupButton}
            >
              Yes
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className={styles.popupButton}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsFR;

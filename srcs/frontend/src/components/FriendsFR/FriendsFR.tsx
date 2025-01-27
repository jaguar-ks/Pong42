"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import styles from './friends.module.css'
import sendMsgIcon from '../../../assets/send message.svg'
import addFriendIcon from '../../../assets/add-friendBlack.svg'
import challengeIcon from '../../../assets/challengeBlack.svg'
import blockFriendIcon from '../../../assets/blockFriend.svg'
import { useUserContext } from '@/context/UserContext'
import { useRouter, useSearchParams } from 'next/navigation'

const FriendsFR = ({id}) => {
  const { searchedUserData, updateSearchedUserData } = useUserContext();
  const [showPopup, setShowPopup] = useState(false);


  const router = useRouter()
  const sendFriendRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/me/connections/`,
        {
            "recipient_id": id
        },
        { withCredentials: true }
      );
      console.log("Friend request sent:", response.data);
      updateSearchedUserData({
        ...searchedUserData,
        connection: {
          ...searchedUserData.connection,
          status: "sent_request"
        }
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
      await axios.delete(
        `http://localhost:8000/api/users/me/connections/${searchedUserData.connection.id}/`,
        { withCredentials: true }
      );
      console.log("Friend request cancelled");
      updateSearchedUserData({
        ...searchedUserData,
        connection: {
          ...searchedUserData.connection,
          status: null
        }
      });
    } catch (error) {
      console.error("Error cancelling friend request:", error);
    }
    setShowPopup(false);
  };

  const sendMessage = () => {
    console.log("Sending message");
    // Implement message sending logic here
  };

  const sendChallenge = () => {
    console.log("Sending game challenge");
    // Implement challenge sending logic here
  };

  const blockUser = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/me/connections/block/`,
        {
          "recipient_id": id
        },
        { withCredentials: true }
      );
      console.log("User blocked:", response.data);
      router.push("/users/home")
      
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  return (
    <div className={styles.friends}>
      <div className={styles.buttonWrapper}>
        <button
          onClick={searchedUserData?.connection?.status === "sent_request" ? cancelFriendRequest : sendFriendRequest}
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
            {
              searchedUserData?.connection?.status === "sent_request"
              ? "Cancel Request"
              : searchedUserData?.connection?.status === "friends"
              ? "Friends"
              : "Send Request"
            }
          </span>
        </button>
      </div>
      <div className={styles.buttonWrapper}>
        <button
          onClick={sendMessage}
          className={styles.button}
        >
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
        <button
          onClick={sendChallenge}
          className={styles.button}
        >
          <div className={styles.iconWrapper}>
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
        <button
          onClick={blockUser}
          className={styles.button}
        >
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
            <button onClick={confirmCancelRequest} className={styles.popupButton}>Yes</button>
            <button onClick={() => setShowPopup(false)} className={styles.popupButton}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsFR;


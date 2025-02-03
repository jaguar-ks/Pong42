"use client"

import type React from "react"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/navigation"
import styles from "./friends.module.css"
import sendMsgIcon from "../../../assets/send message.svg"
import addFriendIcon from "../../../assets/add-friendBlack.svg"
import blockFriendIcon from "../../../assets/blockFriend.svg"
import { useUserContext } from "@/context/UserContext"

type FriendsFRProps = {
  id: number
}

const FriendsFR: React.FC<FriendsFRProps> = ({ id }) => {
  const { searchedUserData, updateSearchedUserData } = useUserContext()
  const router = useRouter()

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/me/connections/`,
        { recipient_id: id },
        { withCredentials: true },
      )
      console.log("Friend request sent:", response.data)
      updateSearchedUserData({
        ...searchedUserData,
        connection: {
          ...(searchedUserData?.connection || { id: 0 }),
          status: "sent_request",
        },
      })
    } catch (error) {
      console.error("Error sending friend request:", error)
    }
  }

  const sendMessage = () => {
    router.push("/users/chat")
  }

  const blockUser = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/me/connections/block/`,
        { recipient_id: id },
        { withCredentials: true },
      )
      console.log("User blocked:", response.data)
      router.push("/users/home")
    } catch (error) {
      console.error("Error blocking user:", error)
    }
  }

  return (
    <div className={styles.friends}>
      <div className={styles.buttonWrapper}>
        <button
          onClick={sendFriendRequest}
          className={styles.button}
          disabled={searchedUserData?.connection?.status === "sent_request"}
        >
          <div className={styles.iconWrapper}>
            <Image
              src={addFriendIcon || "/placeholder.svg"}
              alt="Send Request"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>
            {searchedUserData?.connection?.status === "sent_request"
              ? "Request Sent"
              : searchedUserData?.connection?.status === "friends"
                ? "Friends"
                : "Send Request"}
          </span>
        </button>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={sendMessage} className={styles.button}>
          <div className={styles.iconWrapper}>
            <Image
              src={sendMsgIcon || "/placeholder.svg"}
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
        <button onClick={blockUser} className={styles.button}>
          <div className={styles.iconWrapper}>
            <Image
              src={blockFriendIcon || "/placeholder.svg"}
              alt="Block"
              width={24}
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.buttonText}>Block</span>
        </button>
      </div>
    </div>
  )
}

export default FriendsFR


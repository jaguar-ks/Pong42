"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import TestImage from "../../../assets/player.png";
import styles from "./friends.module.css";

const buttons: string[] = ["Friends", "Request", "Blocked"];

type RequestType = {
    id: number;
    user: {
        id: number;
        username: string;
        avatar_url: string | null;
        is_online: boolean;
    };
    status: string;
    created_at: string;
};

type BlockType = {
    id: number;
    user: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    status: string;
    created_at: string;
};

const Friends = () => {
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [sentRequest, setSentRequest] = useState<RequestType[]>([]);
    const [blocked, setBlocked] = useState<BlockType[]>([]);
    const [friends, setFriends] = useState<BlockType[]>([]);
    const [nowBlocked, setNowBlocked] = useState<BlockType[]>([]);
    const [clicked, setClicked] = useState("Friends");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/users/me/connections/`, {
                    withCredentials: true,
                });
                setRequests(res.data.results.filter((item: any) => item.status === "incoming_request"));
                setSentRequest(res.data.results.filter((item: any) => item.status === "sent_request"));
                setBlocked(res.data.results.filter((item: any) => item.status === "blocked"));
                setFriends(res.data.results.filter((item: any) => item.status === "friends"));
            } catch (err) {
                console.error("Error in fetching user data", err);
            }
        };

        fetchData();
    }, []);

    const handleBlock = async (id: number) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/users/me/connections/block/`,
                {
                    "recipient_id": id
                },
                { withCredentials: true }
            );
            console.log("User blocked:", response.data);

        // Move the blocked user from friends to blocked
        const blockedFriend = friends.find(friend => friend.user.id === id);
        if (blockedFriend) {
            setFriends(prevFriends => prevFriends.filter(friend => friend.user.id !== id));
            setBlocked(prevBlocked => [...prevBlocked, blockedFriend]);
        }
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const FriendsList = () => (
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
                            <button className={`${styles.actionButton} ${styles.blockButton}`} onClick={() => handleBlock(friend.user.id)}>Block</button>
                        </div>
                    </div>
                </div>
            ))}
            
        </div>
    );

    const handleAcceptRequest = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/me/connections/${id}/accept/`, {
                withCredentials: true,
            });
            const acceptedRequest = requests.find((item) => item.id === id);
            
            if (acceptedRequest) {
                setFriends((prevFriends) => [
                    ...prevFriends,
                    {
                        id: acceptedRequest.id,
                        user: acceptedRequest.user,
                        status: "friends",
                        created_at: acceptedRequest.created_at,
                    },
                ]);
                setRequests((prevRequests) => prevRequests.filter((item) => item.id !== id));
            }
    
            console.log("Friend request accepted successfully");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleRejectRequest = async (id: number) => {
        try {
            const resp = await axios.delete(`http://localhost:8000/api/users/me/connections/${id}/`, {
                withCredentials: true,
            });
            if (resp.status === 204) {
                setRequests((prevRequests) => prevRequests.filter((item) => item.id !== id));
            }
            console.log("Friend request rejected successfully");
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    const Request = () => (
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
                        <div className={styles.buttons}>
                            <button
                                className={`${styles.actionButton} ${styles.acceptButton}`}
                                onClick={() => handleAcceptRequest(item.id)}
                                >
                                Accept
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.blockButton}`}
                                onClick={() => handleRejectRequest(item.id)}
                                >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleUnblock = async (id: number) => {
        console.log("id : " + id);
        const idd = id + 1;
        try {
            await axios.delete(`http://localhost:8000/api/users/me/connections/${id}/`, {
                withCredentials: true,
            });
            setBlocked(blocked.filter((item) => item.id !== id));
            setNowBlocked(nowBlocked.filter((item) => item.id !== id));
            console.log("User unblocked successfully 1");
        } catch (errr) {
            try {
                await axios.delete(`http://localhost:8000/api/users/me/connections/${idd}/`, {
                    withCredentials: true,
                });
                setBlocked(blocked.filter((item) => item.id !== idd - 1));
                setNowBlocked(nowBlocked.filter((item) => item.id !== idd - 1));
                console.log("User unblocked successfully 2 ");
            } catch (error) {
                console.error("errrrr", error);
            }
        }
    };

    const Blocked = () => (
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
                            onClick={() => handleUnblock(item.id)}
                        >
                            Unblock
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleClick = (name: string) => {
        setClicked(name);
    };

    const handleData = () => {
        if (clicked === "Friends") return <FriendsList />;
        if (clicked === "Request") return <Request />;
        if (clicked === "Blocked") return <Blocked />;
    };

    return (
        <div className={styles.friends}>
            <div className={styles.buttons}>
                {buttons.map((item, index) => (
                    <div className={styles.buttonContainer} key={index}>
                        <button
                            onClick={() => handleClick(item)}
                            className={clicked === item ? styles.buttonClicked : styles.button}
                        >
                            {item}
                        </button>
                        {item === "Request" && clicked !== "Request" && requests.length > 0 && (
                            <span className={styles.requestCount}>{requests.length}</span>
                        )}
                        {item === "Friends" && clicked !== "Friends" && friends.length > 0 && (
                            <span className={styles.friendCount}>{friends.length}</span>
                        )}
                        {item === "Blocked" && clicked !== "Blocked" && blocked.length > 0 && (
                            <span className={styles.blockedCount}>{blocked.length}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.data}>{handleData()}</div>
        </div>
    );
};

export default Friends;


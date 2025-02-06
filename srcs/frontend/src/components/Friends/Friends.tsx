"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import TestImage from "../../../assets/player.png";
import styles from "./friends.module.css";
import { useWebSocket } from "@/context/WebSocketContext";
import { useRouter } from "next/navigation";
import { useGameSocket } from "@/context/GameSocketContext";
import { useUserContext } from "@/context/UserContext";
import Api from "@/lib/api";

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
    const [blocked, setBlocked] = useState<BlockType[]>([]);
    const [friends, setFriends] = useState<BlockType[]>([]);
    const [nowBlocked, setNowBlocked] = useState<BlockType[]>([]);
    const [clicked, setClicked] = useState("Friends");
    const { connectionUpdate, setConnectionUpdate } = useWebSocket();
    const router = useRouter();
    const { setGameStarted, setRoom } = useGameSocket();
    const { userData } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Api.get(`/users/me/connections/`, {
                    withCredentials: true,
                });
                setRequests(res.data.results.filter((item: RequestType) => item.status === "incoming_request"));
                setBlocked(res.data.results.filter((item: BlockType) => item.status === "blocked"));
                setFriends(res.data.results.filter((item: BlockType) => item.status === "friends"));
            } catch (err) {
                console.error("Error in fetching user data", err);
            }
        };
        fetchData();
        if (connectionUpdate) {
            setConnectionUpdate(false);
        }
    }, [connectionUpdate, setConnectionUpdate]);

    const handleBlock = async (id: number) => {
        router.push(`/users/chat/${id}`);
    };

    const handleChallenge = (user: {id: number, username: string, avatar_url: string | null}) => {
        setGameStarted(true);
        setRoom(userData.username + "_" + user.username);
        router.push(`/users/game/online/`);
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
                            <button className={`${styles.actionButton} ${styles.challengeButton}`} onClick={() => handleChallenge(friend.user)}>Challenge</button>
                            <button className={`${styles.actionButton} ${styles.messageButton}`} onClick={() => handleBlock(friend.user.id)}>Send message</button>
                        </div>
                    </div>
                </div>
            ))}
            
        </div>
    );

    const handleAcceptRequest = async (id: number) => {
        try {
            const response = await Api.get(`/users/me/connections/${id}/accept/`, {
                withCredentials: true,
            });
            console.log(response);
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
            const resp = await Api.delete(`/users/me/connections/${id}/`, {
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
            await Api.delete(`/users/me/connections/${id}/`, {
                withCredentials: true,
            });
            setBlocked(blocked.filter((item) => item.id !== id));
            setNowBlocked(nowBlocked.filter((item) => item.id !== id));
            console.log("User unblocked successfully 1");
        } catch (errr) {
            try {
                await Api.delete(`/users/me/connections/${idd}/`, {
                    withCredentials: true,
                });
                setBlocked(blocked.filter((item) => item.id !== idd - 1));
                setNowBlocked(nowBlocked.filter((item) => item.id !== idd - 1));
                console.log("User unblocked successfully 2 ",errr);

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

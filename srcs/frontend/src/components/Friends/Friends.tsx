"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import axios from 'axios';
import TestImage from '../../../assets/player.png'
import styles from './friends.module.css'

const buttons: string[] = ["Online", "Request", "Blocked"];
const OnlinePeople = [
    {
        name: "Ismail Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Imrane Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Anas Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Ismail Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    }
];

type RequestType = {
    id: number;
    user1: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    state: string;
    created_at: string;
};
type BlockType = {
    id: number;
    user2: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    state: string;
    created_at: string;
};

const Friends = () => {
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [blocked, setBlocked] = useState<BlockType[]>([]);
    const [clicked, setClicked] = useState("Online");

    useEffect(() => {
        if (clicked === "Request" || clicked === "Blocked") {
            fetchRequests();
            fetchBlocked();
        }
    }, [clicked]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/users/me/relationships/friend_requests/`);
            setRequests(res.data);
        } catch (err) {
            console.log("Error in fetching user data", err);
        }
    };
    const fetchBlocked = async () => {
        try {
            const res1 = await axios.get(`http://localhost:8000/api/users/me/relationships/block_list/`);
            setBlocked(res1.data);
        } catch (err) {
            console.log("Error in fetching user data", err);
        }
    };

    const Online = () => (
        <div>
            {OnlinePeople.map((item, index) => (
                <div className={styles.item} key={index}>
                    <Image src={item.url} alt={item.name} width={50} height={50} className={styles.image} />
                    <div className={styles.content}>
                        <h3 className={styles.name}>{item.name}</h3>
                        <p className={styles.message}>{item.msg}</p>
                        <div className={styles.actionButtons}>
                            <button className={`${styles.actionButton} ${styles.challengeButton}`}>Challenge</button>
                            <button className={`${styles.actionButton} ${styles.messageButton}`}>Message</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleAcceptRequest = async (id: number) => {
        try {
            await axios.post(`http://localhost:8000/api/users/me/relationships/${id}/accept_request/`);
            setRequests(requests.filter(item => item.id !== id));
            console.log("Friend request accepted successfully");
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    }

    const Request = () => (
        <div>
            {requests.map((item) => (
                <div className={styles.item} key={item.id}>
                    <Image src={item.user1.avatar_url || TestImage} alt={item.user1.username} width={50} height={50} className={styles.image} />
                    <div className={styles.content}>
                        <h3 className={styles.name}>{item.user1.username}</h3>
                        <p className={styles.message}>Friend request from {item.user1.username}</p>
                        <button 
                            className={`${styles.actionButton} ${styles.acceptButton}`}
                            onClick={() => handleAcceptRequest(item.user1.id)}
                        >
                            Accept
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleUnblock = async (id: number) => {
        try {
            await axios.post(`http://localhost:8000/api/users/me/relationships/${id}/remove_relationship/`);
            setBlocked(blocked.filter(item => item.id !== id));
            console.log("User unblocked successfully");
        } catch (error) {
            console.error("Error unblocking user", error);
        }
    };

    const Blocked = () => (
        <div>
            {blocked.map((item) => (
                <div className={styles.item} key={item.id}>
                    <Image src={item.user2.avatar_url || TestImage} alt={item.user2.username} width={50} height={50} className={styles.image} />
                    <div className={styles.content}>
                        <h3 className={styles.name}>{item.user2.username}</h3>
                        <p className={styles.message}>Blocked user</p>
                        <button 
                            className={`${styles.actionButton} ${styles.unblockButton}`}
                            onClick={() => handleUnblock(item.user2.id)}
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
        if (clicked === "Online") return <Online />;
        else if (clicked === "Request") return <Request />;
        else if (clicked === "Blocked") return <Blocked />;
    };

    return (
        <div className={styles.friends}>
            <div className={styles.buttons}>
                {buttons.map((item, index) => (
                    <div className={styles.buttonContainer}>
                        <button
                            key={index}
                            onClick={() => handleClick(item)}
                            className={clicked === item ? styles.buttonClicked : styles.button}
                            >
                            {item}
                        </button>
                    </div>
                ))}
            </div>
            <div className={styles.data}>
                {handleData()}
            </div>
        </div>
    );
};

export default Friends;
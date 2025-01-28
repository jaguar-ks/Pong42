'use client';

import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import styles from './changeUsername.module.css';

interface ChangeUsernameProps {
  setCurrentPage: (page: string) => void;
}

type ErrorType = string[];

const ChangeUsername: React.FC<ChangeUsernameProps> = ({ setCurrentPage }) => {
  const [newUsername, setNewUsername] = useState<string>("");
  const [error, setError] = useState<ErrorType>([]);
  const newUsernameInputRef = useRef<HTMLInputElement>(null);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    if (newUsernameInputRef.current) {
      newUsernameInputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handleChangeUsername = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/users/me/",
        { username: newUsername },
        { withCredentials: true }
      );
      console.log(res.data);
      updateUserData({ ...userData, username: newUsername });
      setCurrentPage("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.username || []);
      } else {
        throw err;
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setCurrentPage("");
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Change Username</h2>
          <div className={styles.form}>
            <label className={styles.label}>Current Username:</label>
            <input disabled={true} className={styles.input} value={userData.username} />
            <label className={styles.label}>New Username:</label>
            <input
              ref={newUsernameInputRef}
              className={styles.input}
              value={newUsername}
              onChange={handleInputChange}
              placeholder="Enter new username"
            />
            {error.length > 0 && error.map((item, index) => (
              <span className={styles.error} key={index}>{item}</span>
            ))}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleChangeUsername}>Update</button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setCurrentPage("")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUsername;

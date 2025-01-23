'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import styles from './change.module.css';

interface ChangeLastnameProps {
  setCurrentPage: (page: string) => void;
}

const ChangeLastname: React.FC<ChangeLastnameProps> = ({ setCurrentPage }) => {
  const [newLastName, setNewLastName] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLastName(e.target.value);
  };

  const handleChangeLastName = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "https://localhost/api/users/me/",
        { last_name: newLastName },
        { withCredentials: true }
      );
      console.log(res.data);
      updateUserData({ ...userData, last_name: newLastName });
      setCurrentPage("");
    } catch (err: any) {
      setError(err.response?.data?.last_name || []);
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
          <h2 className={styles.title}>Change Last Name</h2>
          <div className={styles.form}>
            <label className={styles.label}>Current Last Name:</label>
            <input disabled={true} className={styles.input} value={userData.last_name} />
            <label className={styles.label}>New Last Name:</label>
            <input 
              ref={inputRef} 
              className={styles.input} 
              value={newLastName} 
              onChange={handleInputChange}
              placeholder="Enter new last name"
            />
            {error.length > 0 && error.map((item, index) => (
              <span className={styles.error} key={index}>{item}</span>
            ))}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleChangeLastName}>Update</button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setCurrentPage("")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLastname;


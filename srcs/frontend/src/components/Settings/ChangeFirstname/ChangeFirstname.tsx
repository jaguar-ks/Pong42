'use client';

import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import styles from './change.module.css';

interface ChangeFirstnameProps {
  setCurrentPage: (page: string) => void;
}

const ChangeFirstname: React.FC<ChangeFirstnameProps> = ({ setCurrentPage }) => {
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFirstName(e.target.value);
  };

  const handleChangeFirstName = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/users/me/",
        { first_name: newFirstName },
        { withCredentials: true }
      );
      console.log(res.data);
      updateUserData({ ...userData, first_name: newFirstName });
      setCurrentPage("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.first_name || []);
      }
    }
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setCurrentPage("");
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Change First Name</h2>
          <div className={styles.form}>
            <label className={styles.label}>Current First Name:</label>
            <input disabled={true} className={styles.input} value={userData.first_name} />
            <label className={styles.label}>New First Name:</label>
            <input 
              ref={inputRef} 
              className={styles.input} 
              value={newFirstName} 
              onChange={handleInputChange}
              placeholder="Enter new first name"
            />
            {error.length > 0 && error.map((item, index) => (
              <span className={styles.error} key={index}>{item}</span>
            ))}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleChangeFirstName}>Update</button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setCurrentPage("")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeFirstname;

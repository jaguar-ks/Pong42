'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './change.module.css';
import Api from '@/lib/api';

interface ChangePasswordProps {
  setCurrentPage: (page: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ setCurrentPage }) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(["Passwords do not match"]);
      return;
    }
    try {
      const res = await Api.patch(
        "/users/me/",
        { password: newPassword },
        { withCredentials: true }
      );
      console.log(res.data);
      setCurrentPage("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.password || []);
      } else {
        setError(["An unknown error occurred"]);
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
          <h2 className={styles.title}>Change Password</h2>
          <div className={styles.form}>
            <label className={styles.label}>New Password:</label>
            <input 
              type="password"
              ref={inputRef} 
              className={styles.input} 
              value={newPassword} 
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
            />
            <label className={styles.label}>Confirm New Password:</label>
            <input 
              type="password"
              className={styles.input} 
              value={confirmPassword} 
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
            />
            {error.length > 0 && error.map((item, index) => (
              <span className={styles.error} key={index}>{item}</span>
            ))}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleChangePassword}>Update</button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setCurrentPage("")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

"use client";
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';

interface ChangePasswordProps {
  setCurrentPage: (page: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ setCurrentPage }) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/users/me/",
        { password: newPassword },
        { withCredentials: true }
      );
      console.log(res.data);
      updateUserData({ ...userData, password: newPassword });
      setCurrentPage("");
    } catch (err: any) {
      setError(err.response?.data?.password || []);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setCurrentPage("");
    }
  };

  return (
    <div className={classes.NotifNotif} onClick={handleOverlayClick}>
      <div className={classes.bigWindowContainer}>
        <div className={classes.windowContainer}>
          <div className={classes.window}>
            <div className={classes.element}>
              <h2 className={classes.title}>Change Password</h2>
              <label className={classes.label}>Current Password:</label>
              <input type="password" disabled={true} className={classes.input} value="********" />
              <label className={classes.label}>New Password:</label>
              <input 
                type="password"
                ref={inputRef} 
                className={classes.input} 
                value={newPassword} 
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
              {error.length > 0 && error.map((item, index) => (
                <span className={classes.errors} key={index}>{item}</span>
              ))}
              <div className={classes.buttonContainer}>
                <button className={classes.button} onClick={handleChangePassword}>Update</button>
                <button className={classes.button} onClick={() => setCurrentPage("")}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;


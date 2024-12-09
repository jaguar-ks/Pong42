"use client";
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';

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
        "http://localhost:8000/api/users/me/",
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
    <div className={classes.NotifNotif} onClick={handleOverlayClick}>
      <div className={classes.bigWindowContainer}>
        <div className={classes.windowContainer}>
          <div className={classes.window}>
            <div className={classes.element}>
              <h2 className={classes.title}>Change Last Name</h2>
              <label className={classes.label}>Current Last Name:</label>
              <input disabled={true} className={classes.input} value={userData.last_name} />
              <label className={classes.label}>New Last Name:</label>
              <input 
                ref={inputRef} 
                className={classes.input} 
                value={newLastName} 
                onChange={handleInputChange}
                placeholder="Enter new last name"
              />
              {error.length > 0 && error.map((item, index) => (
                <span className={classes.errors} key={index}>{item}</span>
              ))}
              <div className={classes.buttonContainer}>
                <button className={classes.button} onClick={handleChangeLastName}>Update</button>
                <button className={classes.button} onClick={() => setCurrentPage("")}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLastname;


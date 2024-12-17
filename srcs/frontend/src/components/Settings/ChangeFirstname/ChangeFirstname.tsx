"use client";
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';

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

  const handleChangeFirstName = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
    } catch (err: any) {
      setError(err.response?.data?.first_name || []);
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
              <h2 className={classes.title}>Change First Name</h2>
              <label className={classes.label}>Current First Name:</label>
              <input disabled={true} className={classes.input} value={userData.first_name} />
              <label className={classes.label}>New First Name:</label>
              <input 
                ref={inputRef} 
                className={classes.input} 
                value={newFirstName} 
                onChange={handleInputChange}
                placeholder="Enter new first name"
              />
              {error.length > 0 && error.map((item, index) => (
                <span className={classes.errors} key={index}>{item}</span>
              ))}
              <div className={classes.buttonContainer}>
                <button className={classes.button} onClick={handleChangeFirstName}>Update</button>
                <button className={classes.button} onClick={() => setCurrentPage("")}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeFirstname;


"use client";
import { useContext, useState, useEffect, useRef, ChangeEvent } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

interface ChangeLastnameProps {
  setCurrentPage: (page: string) => void;
}

const ChangeLastname: React.FC<ChangeLastnameProps> = ({ setCurrentPage }) => {
  const [oldLastName, setOldLastName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const router = useRouter();
  // const { UserData, updateUserData } = useContext(UserContext);
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

    const handleChangeLastName = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        const res = await axios.patch(
          "http://localhost:8000/api/users/me/",
          { last_name: newLastName },
        );
        console.log(res.data);
        updateUserData({ ...userData, last_name: newLastName });
        setCurrentPage("");
      } catch (err: any) {
        setError(err.response?.data?.last_name || []);
      }
    };

  return (
    <div className={classes.NotifNotif}>
      <div className={classes.window} onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("test") }}>
        <div className={classes.element}>
          <label className={classes.label}>Old LastName:</label>
          <input disabled={true} className={classes.input} value={userData.last_name} />
          <label className={classes.label}>New LastName:</label>
          <input ref={inputRef} className={classes.input} value={newLastName} onChange={handleInputChange} />
          {error.length > 0 && error.map((item, index) => <span className={classes.errors} key={index}>{item}</span>)}
          <div className={classes.buttonContainer}>
            <button className={classes.button} onClick={handleChangeLastName}>Update Infos</button>
            <button className={classes.button} onClick={() => setCurrentPage("")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLastname;

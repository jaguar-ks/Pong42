"use client";
import { useContext, useState, useEffect, useRef, ChangeEvent } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

interface ChangePasswordProps {
  setCurrentPage: (page: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ setCurrentPage }) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
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
    setNewPassword(e.target.value);
  };

    const handleChangePassword = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        const res = await axios.patch(
          "http://localhost:8000/api/users/me/",
          { password: newPassword },
        );
        console.log(res.data);
        updateUserData({ ...userData, password: newPassword });
        setCurrentPage("");
      } catch (err: any) {
        setError(err.response?.data?.password || []);
      }
    };

  return (
    <div className={classes.NotifNotif}>
      <div className={classes.window} onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("test") }}>
        <div className={classes.element}>
          <label className={classes.label}>Old Password:</label>
          <input disabled={true} className={classes.input} value="********" />
          <label className={classes.label}>New Password:</label>
          <input type='password' ref={inputRef} className={classes.input} value={newPassword} onChange={handleInputChange} />
          {error.length > 0 && error.map((item, index) => <span className={classes.errors} key={index}>{item}</span>)}
          <div className={classes.buttonContainer}>
            <button className={classes.button} onClick={handleChangePassword}>Update Infos</button>
            <button className={classes.button} onClick={() => setCurrentPage("")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

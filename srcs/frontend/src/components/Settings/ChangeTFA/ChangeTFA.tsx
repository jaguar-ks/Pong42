"use client";
import { useState, useEffect } from 'react';
import classes from './change.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import QRCode from 'react-qr-code';

interface ChangeTFAProps {
  setCurrentPage: (page: string) => void;
}

const ChangeTFA: React.FC<ChangeTFAProps> = ({ setCurrentPage }) => {
  const [boolIsActive, setBoolIsActive] = useState<boolean>(false);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [toggleActive, setToggleActive] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userData } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/");
        setBoolIsActive(res.data.two_fa_enabled);
        setToggleActive(res.data.two_fa_enabled);
      } catch (err: any) {
        console.log("Error in fetching user data", err);
      } finally {
        setIsloading(false);
      }
    };
    fetchData();
  }, []);

  const handleActivateTFA = async () => {
      setIsloading(true);
      setToggleActive(!toggleActive);
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/");
        setCode(res.data.otp_uri);
      } catch (err: any) {
        console.log("Error in fetching OTP URI", err);
      } finally {
        setIsloading(false);
      }
  };

  const handleDone = async () => {
    setIsloading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/2fa/enable/", {
        "otp_code": inputCode,
      });

      // Navigate back after success
      setCurrentPage("");
    } catch (err: any) {
      setError("Invalid OTP code. Please try again.");
    } finally {
      setIsloading(false);
    }
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
      <div
        className={classes.window}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className={classes.element}>
          <div className={classes.toggleContainer}>
            <button
              className={toggleActive ? classes.toggleButtonActive : classes.toggleButton}
              onClick={handleActivateTFA}
            >
              <div className={classes.dote}></div>
            </button>
          </div>
           {(!boolIsActive && code) && <QRCode value={code} size={256} />}
            <input
              onChange={(e) => setInputCode(e.target.value)}
              className={classes.codeInput}
              type="text"
              placeholder="_ _ _ _ _ _"
              value={inputCode}
            />
          {error && <p className={classes.error}>{error}</p>}
          <div className={classes.buttonContainer}>
            <button className={classes.button} onClick={handleDone} disabled={isloading}>
              {isloading ? "Loading..." : "Done"}
            </button>
            <button className={classes.button} onClick={() => setCurrentPage("")}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeTFA;

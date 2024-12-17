"use client";
import { useState, useEffect } from "react";
import classes from './change.module.css';
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import QRCode from "react-qr-code";

interface ChangeTFAProps {
  setCurrentPage: (page: string) => void;
}

const ChangeTFA: React.FC<ChangeTFAProps> = ({ setCurrentPage }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/", { withCredentials: true });
        setIsActive(res.data.two_fa_enabled);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleToggleTFA = async () => {
    setError("");
    if (isActive) {
      setShowInput(true);
    } else {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/", { withCredentials: true });
        setCode(res.data.otp_uri);
        setShowInput(true);
      } catch (err) {
        setError("Failed to fetch QR code. Please try again.");
        console.error("Error fetching QR code:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDone = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (isActive) {
        await axios.post(
          "http://localhost:8000/api/auth/2fa/disable/",
          { otp_code: inputCode },
          { withCredentials: true }
        );
        updateUserData({ ...userData, two_fa_enabled: false });
        setIsActive(false);
        setShowInput(false);
        setInputCode("");
        setCode("");
        setCurrentPage("");
      } else {
        await axios.post(
          "http://localhost:8000/api/auth/2fa/enable/",
          { otp_code: inputCode },
          { withCredentials: true }
        );
        updateUserData({ ...userData, two_fa_enabled: true });
        setIsActive(true);
        setShowInput(false);
        setInputCode("");
        setCode("");
        setCurrentPage("");
      }
      setShowInput(false);
      setInputCode("");
      setCode("");
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
      console.error("Error handling OTP:", err);
    } finally {
      setIsLoading(false);
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
              <h2 className={classes.title}>Two-Factor Authentication</h2>
              <div className={classes.toggleContainer}>
                <button
                  className={classes.toggleButton}
                  onClick={handleToggleTFA}
                  disabled={isLoading || showInput}
                >
                  <div className={isActive ? classes.doteActive : classes.dote}>
                    <p className={classes.buttonText}>{isActive ? "ON" : "OFF"}</p>
                  </div>
                </button>
              </div>
              {showInput && (
                <div className={classes.inputContainer}>
                  {!isActive && code && (
                    <>
                      <p className={classes.instructions}>
                        Scan this QR code with your authenticator app, then enter the 6-digit code below:
                      </p>
                      <QRCode value={code} size={150} />
                    </>
                  )}
                  {isActive && (
                    <p className={classes.instructions}>
                      Enter your current 2FA code to disable Two-Factor Authentication:
                    </p>
                  )}
                  <input
                    onChange={(e) => setInputCode(e.target.value)}
                    className={classes.codeInput}
                    type="text"
                    placeholder="_ _ _ _ _ _"
                    value={inputCode}
                    disabled={isLoading}
                    aria-label="Enter 2FA code"
                  />
                </div>
              )}
              {error && <p className={classes.errors}>{error}</p>}
              <div className={classes.buttonContainer}>
                {showInput && (
                  <button 
                    className={classes.button} 
                    onClick={handleDone} 
                    disabled={isLoading || inputCode.length !== 6}
                  >
                    {isLoading ? "Processing..." : "Done"}
                  </button>
                )}
                <button 
                  className={classes.button} 
                  onClick={() => {
                    setShowInput(false);
                    setInputCode("");
                    setCode("");
                    setCurrentPage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeTFA;


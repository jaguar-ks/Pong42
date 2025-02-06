'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import QRCode from "react-qr-code";
import styles from './change.module.css';
import Api from "@/lib/api";

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
        const res = await Api.get("/users/me/", { withCredentials: true });
        setIsActive(res.data.two_fa_enabled);
      } catch (err) {
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
        const res = await Api.get("/users/me/", { withCredentials: true });
        setCode(res.data.otp_uri);
        setShowInput(true);
      } catch (err) {
        setError("Failed to fetch QR code. Please try again.");
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
        await Api.post(
          "/auth/2fa/disable/",
          { otp_code: inputCode },
          { withCredentials: true }
        );
        updateUserData({ ...userData, two_fa_enabled: false });
        setIsActive(false);
      } else {
        await Api.post(
          "/auth/2fa/enable/",
          { otp_code: inputCode },
          { withCredentials: true }
        );
        updateUserData({ ...userData, two_fa_enabled: true });
        setIsActive(true);
      }
      setShowInput(false);
      setInputCode("");
      setCode("");
      setCurrentPage("");
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
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
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Two-Factor Authentication</h2>
          <div className={styles.form}>
            <div className={`${styles.toggleContainer} ${isActive ? styles.active : ''}`}>
              <button
                className={styles.toggleButton}
                onClick={handleToggleTFA}
                disabled={isLoading || showInput}
                aria-label={isActive ? "Disable 2FA" : "Enable 2FA"}
              >
                <span className={styles.toggleText}>{isActive ? "ON" : "OFF"}</span>
                <span className={styles.toggleSlider}></span>
              </button>
            </div>
            {showInput && (
              <div className={styles.inputContainer}>
                {!isActive && code && (
                  <>
                    <p className={styles.instructions}>
                      Scan this QR code with your authenticator app, then enter the 6-digit code below:
                    </p>
                    <div className={styles.qrCodeContainer}>
                      <QRCode value={code} size={150} />
                    </div>
                  </>
                )}
                {isActive && (
                  <p className={styles.instructions}>
                    Enter your current 2FA code to disable Two-Factor Authentication:
                  </p>
                )}
                <input
                  onChange={(e) => setInputCode(e.target.value)}
                  className={styles.input}
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={inputCode}
                  disabled={isLoading}
                  aria-label="Enter 2FA code"
                  maxLength={6}
                />
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttonContainer}>
              {showInput && (
                <button 
                  className={styles.button}
                  onClick={handleDone} 
                  disabled={isLoading || inputCode.length !== 6}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              )}
              <button 
                className={`${styles.button} ${styles.cancelButton}`}
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
  );
};

export default ChangeTFA;


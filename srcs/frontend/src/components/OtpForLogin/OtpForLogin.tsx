"use client";
import { useState } from 'react';
import classes from './OtpForLogin.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface OtpForLoginProps {
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  username: string;
  password: string;
}

const OtpForLogin: React.FC<OtpForLoginProps> = ({ setErrors, errors, username, password }) => {
  const [inputCode, setInputCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSignin = async (): Promise<void> => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/sign-in/", {
        username: username,
        password: password,
        otp_code: inputCode,
      });
      router.push("/users/home");
    } catch (err) {
      setError("error");
    }
  };

  const handleCancel = (): void => {
    setInputCode("");  // Clear the OTP input field
    setError("");      // Clear any error messages
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
          <input
            onChange={(e) => setInputCode(e.target.value)}
            className={classes.codeInput}
            type="text"
            placeholder="_ _ _ _ _ _"
            value={inputCode}
          />
          {error && <p className={classes.error}>{error}</p>}
          <div className={classes.buttonContainer}>
            <button className={classes.button} onClick={handleSignin}>
              Done
            </button>
            <button className={classes.button} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForLogin;

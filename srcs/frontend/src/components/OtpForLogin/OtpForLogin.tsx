"use client";
import React, { useState } from 'react';
import classes from './OtpForLogin.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import OtpInput from './OtpInput';

interface OtpForLoginProps {
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  username: string;
  password: string;
}

const OtpForLogin: React.FC<OtpForLoginProps> = ({ setErrors, username, password }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleSignin = async (inputCode: string): Promise<void> => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      await axios.post(
        `http://localhost:8000/api/auth/sign-in/`, 
        { username, password, otp_code: inputCode },
        { withCredentials: true }
      );
      router.push("/users/home");
    } catch (err: any) {
      setError(err.response?.data?.otp_code?.[0] || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({
      details: '',
      username: '',
      password: '',
      otp: '',
    });
  };

  return (
    <div className={classes.NotifNotif}>
      <div className={classes.window} onClick={(e) => e.stopPropagation()}>
        <div className={classes.element}>
          <h1>confermation code: </h1>
          <OtpInput
            isLoading={isLoading}
            setErrorBack={setError}
            errorback={error}
            onComplete={handleSignin}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpForLogin;

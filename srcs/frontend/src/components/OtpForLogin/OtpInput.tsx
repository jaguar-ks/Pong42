"use client";
import React, { useState, useRef, useEffect } from 'react';
import classes from './OtpInput.module.css';

interface OtpInputProps {
  onComplete: (code: string) => void;
  onCancel: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({setErrorBack, errorback, onComplete, onCancel, isLoading }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
      setErrorBack("");
    if (isNaN(Number(value))){
        return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      setError('');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (otp.some(digit => digit === '')) {
      setError('Please fill in all digits');
      setErrorBack("")
      return;
    }
    onComplete(otp.join(''));
  };

  return (
    <div>
      <div className={classes.otpContainer}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            className={classes.otpInput}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            placeholder="•"
          />
        ))}
      </div>
      {error && <p className={classes.error}>{error}</p>}
      {errorback && <p className={classes.error}>{errorback}</p>}
      <div className={classes.buttonContainer}>
        <div>
          <button disabled={isLoading} className={`${classes.button} ${classes.submitButton}`} onClick={handleSubmit}>
            {!isLoading ? "Submit" : "loading"}
          </button>
        </div>
        <div className={classes.cancleBtnContainer}>
          <button className={`${classes.button} ${classes.cancelButton}`} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpInput;


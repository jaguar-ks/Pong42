"use client"
import React from 'react'
import classes from './ProgressBarFr.module.css'

// Explicitly type the parameter as a number, and the return type as string
const getLastTwoDigits = (num: number): string => {
  const numberStr = num.toString();
  return numberStr.slice(-2);
};

const getLastThreeDigits = (num: number): string => {
  const numberStr = num.toString();
  if (num === 0) return "0";
  return numberStr.length >= 2 ? numberStr.slice(-3, -2) : numberStr;
};

const ProgressBarFr: React.FC = () => {
  return (
    <div className={classes.container}>
      <div
        className={classes.progressBar}
        style={{ width: `${getLastTwoDigits(999)}%` }}
      ></div>
      <div className={classes.textContainer}>
        <p className={classes.level}>
          level {getLastThreeDigits(999)} - {getLastTwoDigits(678)}%
        </p>
      </div>
    </div>
  )
}

export default ProgressBarFr

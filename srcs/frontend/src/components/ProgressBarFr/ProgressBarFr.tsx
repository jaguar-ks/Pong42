"use client"
import React from 'react'
import classes from './progressBarFr.module.css'

// Helper function to calculate level
const calculateLevel = (rating: number): number => {
  return Math.floor(rating / 100) + 1;
}

// Helper function to calculate percentage
const calculatePercentage = (rating: number): number => {
  return rating % 100;
}

// Define prop types
interface ProgressBarFrProps {
  ratingFr: number; // Explicitly define the type for ratingFr
}

const ProgressBarFr: React.FC<ProgressBarFrProps> = ({ ratingFr }) => {
  const rating = ratingFr || 0; // Default to 0 if ratingFr is undefined
  const level = calculateLevel(rating);
  const percentage = calculatePercentage(rating);

  return (
    <div className={classes.container}>
      <div className={classes.Fr} style={{ width: `${percentage}%` }}></div>
      <div className={classes.textContainer}>
        <p className={classes.level}>Level {level} - {percentage}%</p>
      </div>
    </div>
  );
}

export default ProgressBarFr;

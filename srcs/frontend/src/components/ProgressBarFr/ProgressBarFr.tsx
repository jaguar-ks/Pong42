"use client"
import classes from "./progressBar.module.css"

const calculateLevel = (rating: number): number => {
  if (rating < 500) return 0
  return Math.floor((rating - 500) / 100) + 1
}

const calculatePercentage = (rating: number): number => {
  if (rating === null || rating === undefined) return 0
  if (rating < 500) return 0
  return (rating - 500) % 100
}

const ProgressBar = ({ratingFr}) => {
  const rating = ratingFr;
  const level = calculateLevel(rating)
  const percentage = calculatePercentage(rating)

  return (
    <div className={classes.container}>
      <div className={classes.progressBar} style={{ width: `${percentage}%` }}></div>
      <div className={classes.textContainer}>
        <p className={classes.level}>
          Level {level} - {Math.round(percentage)}%
        </p>
      </div>
    </div>
  )
}

export default ProgressBar

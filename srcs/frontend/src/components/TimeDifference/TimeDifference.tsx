"use client"
import { useEffect, useState } from 'react';

interface TimeDifferenceProps {
  timestamp: string | Date; // Allow both string and Date types for flexibility
}

const TimeDifference: React.FC<TimeDifferenceProps> = ({ timestamp }) => {
  const [timeDiff, setTimeDiff] = useState<string>('');

  useEffect(() => {
    const calculateTimeDiff = () => {
      const now = new Date();
      const pastDate = new Date(timestamp);
      const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

      // Calculate time difference
      const days = Math.floor(diffInSeconds / (3600 * 24));
      const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      // Format the time difference
      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 && days === 0) parts.push(`${hours}h`);
      if (minutes > 0 && hours === 0) parts.push(`${minutes}min`);
      if (seconds > 0 && minutes === 0) parts.push(`${seconds}sec`);

      setTimeDiff(parts.join(' ') + ' ago');
    };

    calculateTimeDiff();

    // Update every minute
    const interval = setInterval(calculateTimeDiff, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <div>{timeDiff}</div>;
};

export default TimeDifference;

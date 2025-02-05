"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from './page.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';
import { useWebSocket } from '@/context/WebSocketContext';
import Api from '@/lib/api';

const Logout: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { updateCurrentPage } = useUserContext();
  const { close } = useWebSocket();


  useEffect(() => {
    updateCurrentPage("logout");
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await Api.get("/auth/test_auth/",{withCredentials: true})
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } finally{
      }
    }
    checkToken();

  }, []);

  const handleNo = () => {
    router.push('/users/home');
  };


  const handleYes = async () => {
    setIsLoading(true);
    try {
      await Api.post("/auth/sign-out/", {}, { withCredentials: true });
      close();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <p className={classes.question}>Are you sure you ant to add header to logout?</p>
      <div className={classes.btnContainer}>
        <button 
          className={`${classes.btn} ${classes.yesBtn}`} 
          onClick={handleYes}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Yes'}
        </button>
        <button 
          className={`${classes.btn} ${classes.noBtn}`} 
          onClick={handleNo}
          disabled={isLoading}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default Logout;

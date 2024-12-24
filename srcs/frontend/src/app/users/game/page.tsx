'use client'

import React, { useEffect, useState } from 'react'
import styles from './styles/Game.module.css'
import { useUserContext } from '@/context/UserContext'
import Image from 'next/image'
import offlineGame from '../../../../assets/offlineGame.svg'
import onlineGame from '../../../../assets/online.svg'
import { useRouter } from 'next/navigation'

const GamePage = () => {
 
  const {updateCurrentPage } = useUserContext();
  const router = useRouter();

  useEffect(() =>{
    updateCurrentPage("game");
  }, []);

  const setGameMode = (mode: string) =>{
    if(mode === "local")
        router.push("/users/game/local");
    else
      router.push("/users/game/online");
  }


  return (
    <div className={styles.container}>
     <h1 className={styles.title}>Choose Your Game Mode :</h1>
     <div className={styles.modeSelection}>
          <button className={styles.imageButton} onClick={() => setGameMode('local')}>
            <Image className={styles.image} src={offlineGame} alt="Local Game" width={200} height={150} />
            <span>Local Game</span>
          </button>
          <button className={styles.imageButton} onClick={() => setGameMode('online')}>
            <Image className={styles.image} src={onlineGame} alt="Online Game" width={200} height={150} />
            <span>Online Game</span>
          </button>
        </div>

    </div>
  )
}

export default GamePage


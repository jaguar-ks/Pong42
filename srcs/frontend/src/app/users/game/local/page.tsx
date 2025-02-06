'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Game.module.css'
import twoPlayers from '../../../../../assets/4players_1.svg'
import fourPlayers from '../../../../../assets/4players_1.svg'
import { useRouter } from 'next/navigation'

import { useUserContext } from '@/context/UserContext'

const Local = () => {

    const {updateCurrentPage } = useUserContext();
    const router = useRouter();
    useEffect(() =>{
        updateCurrentPage("game");
      }, []);

    const setGameType =(gameType: string) =>{
        if(gameType === "single")
            router.push("/users/game/local/1v1");
        else
          router.push("/users/game/local/tournament");
    }

    return(
       <div className={styles.container}>
        <h2 className={styles.subtitle}>Local Game Setup :</h2>
            <div className={styles.gameTypeSelection}>
            <button className={styles.imageButton} onClick={() => setGameType('single')}>
                <Image className={styles.image} src={twoPlayers} alt="1 V 1" width={200} height={150} />
                <span>1 V 1</span>
            </button>
            <button className={styles.imageButton} onClick={() => setGameType('tournament')}>
                <Image className={styles.image} src={fourPlayers} alt="Tournament" width={200} height={150} />
                <span>Tournament</span>
            </button>
            </div>
       </div>
    )
}

export default Local
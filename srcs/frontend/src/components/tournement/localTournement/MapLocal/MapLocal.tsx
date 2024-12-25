"use client"
import { useState } from "react";
import styles from './MapLocal.module.css'
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import playerImage from '../../../../../assets/player.png'
import leftLine from '../../../../../assets/lines/leftLine.png'
import middleLine from '../../../../../assets/lines/middleLine.png'
import rightLine from '../../../../../assets/lines/rightLine.png'
const MapLocal = () =>{


    return(
        <div className={styles.container}>
            <div className={styles.twoPlayers}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>SemiFinal</p>
                </div>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
            </div>
            <div className={styles.lines}>
                <Image className={styles.lineImage} alt="leftline" src={leftLine} height={100} width={100} />
            </div>
            <div className={styles.onePlayer}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
            </div>
            <div className={styles.lines}>
                <Image className={styles.lineImage} alt="middleLine" src={middleLine} height={100} width={100} />
            </div>
            <div className={styles.winnerplayer}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
            </div>
            <div className={styles.lines}>
            <Image className={styles.lineImage} alt="middleLine" src={middleLine} height={100} width={100} />
            </div>
            <div className={styles.onePlayer}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
            </div>
            <div className={styles.lines}>
            <Image className={styles.lineImage} alt="rightLine" src={rightLine} height={100} width={100} />
            </div>
            <div className={styles.twoPlayers}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={playerImage} width={50} height={50}/>
                        <p className={styles.playerName}>ismail barka</p>
                    </div>
                    <p className={styles.placeText}>semiFinal</p>
                </div>
            </div>
        </div>
    )
}

export default MapLocal;
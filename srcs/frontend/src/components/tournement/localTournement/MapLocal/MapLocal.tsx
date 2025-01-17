"use client"
import { useState } from "react";
import styles from './MapLocal.module.css'
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import playerImage from '../../../../../assets/player.png'
import leftLine from '../../../../../assets/lines/leftLine.png'
import middleLine from '../../../../../assets/lines/middleLine.png'
import rightLine from '../../../../../assets/lines/rightLine.png'
import catProfileImage from '../../../../../assets/animalsProfile/player3gif.gif'
import dogProfileImage from '../../../../../assets/animalsProfile/player4gif.gif'
import lionProfileImage from '../../../../../assets/animalsProfile/player1gif.gif'
import dankyProfileImage from '../../../../../assets/animalsProfile/player2gif.gif'
import questionMark from '../../../../../assets/animalsProfile/questionMarkGif.webp'
const MapLocal = () =>{
    const {localTournementNames, setLocalTournementNames, localTournementCount, setLocalTournementCount} = useUserContext();

    return(
        <div className={styles.container}>
            <div className={styles.twoPlayers}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={lionProfileImage} width={50} height={50}/>
                        <p className={styles.playerName}>{localTournementNames[2]}</p>
                    </div>
                    <p className={styles.placeText}>quatreFinal</p>
                </div>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={dogProfileImage} width={50} height={50}/>
                        <p className={styles.playerName}>{localTournementNames[3]}</p>
                    </div>
                    <p className={styles.placeText}>quatreFinal</p>
                </div>
            </div>
            <div className={styles.lines}>
                <Image className={styles.lineImage} alt="leftline" src={leftLine} height={100} width={100} />
            </div>
            <div className={styles.onePlayer}>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={questionMark} width={50} height={50}/>
                        <p className={styles.playerName}>???? ????</p>
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
                        <Image className={styles.playerImage} alt="player Image" src={questionMark} width={50} height={50}/>
                        <p className={styles.playerName}>???? ????</p>
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
                        <Image className={styles.playerImage} alt="player Image" src={questionMark} width={50} height={50}/>
                        <p className={styles.playerName}>???? ????</p>
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
                        <Image className={styles.playerImage} alt="player Image" src={dankyProfileImage} width={50} height={50}/>
                        <p className={styles.playerName}>{localTournementNames[1]}</p>
                    </div>
                    <p className={styles.placeText}>quatreFinal</p>
                </div>
                <div className={styles.PlayerAndPlace}>
                    <div className={styles.playerInfos}>
                        <Image className={styles.playerImage} alt="player Image" src={catProfileImage} width={50} height={50}/>
                        <p className={styles.playerName}>{localTournementNames[0]}</p>
                    </div>
                    <p className={styles.placeText}>quatreFinal</p>
                </div>
            </div>
        </div>
    )
}

export default MapLocal;
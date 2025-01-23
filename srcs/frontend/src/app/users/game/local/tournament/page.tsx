"use client";
import { useState } from "react";

import EntreInfos from "@/components/tournement/localTournement/EntreInfos/EntreInfos";
import { useUserContext } from "@/context/UserContext";

import styles from './EntreInfos.module.css'
import MapLocal from "@/components/tournement/localTournement/MapLocal/MapLocal";


const RoundOne = ({setPage}) =>{
    const {
        localTournementNames,
        setLocalTournementNames
    } = useUserContext();

    const handlePlayerWins = (winnerName: string) =>{
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    }

    return(
        <div className={styles.containerwinnerFstRound}>
            <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[0])}>winner : {localTournementNames[0]}</button>
            <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[1])}>winner : {localTournementNames[1]}</button>
        </div>
    )
}
const RoundTwo = ({setPage}) =>{
    const {
        localTournementNames,
        setLocalTournementNames
    } = useUserContext();

    const handlePlayerWins = (winnerName: string) =>{
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    }

    return(
        <div className={styles.containerwinnerFstRound}>
            <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[2])}>winner : {localTournementNames[2]}</button>
            <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[3])}>winner : {localTournementNames[3]}</button>
        </div>
    )
}
const RoundTree = ({setPage}) =>{
    const {
        localTournementNames,
        setLocalTournementNames
    } = useUserContext();

    const handlePlayerWins = (winnerName: string) =>{
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    }

    return(
        <div className={styles.containerwinnerFstRound}>
        <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[4])}>winner : {localTournementNames[4]}</button>
        <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[5])}>winner : {localTournementNames[5]}</button>
    </div>
    )
}


const Tournament = () => {
    const {
        localTournementNames,
        setLocalTournementNames,
        localTournementCount,
        setLocalTournementCount
    } = useUserContext();
    const [page, setPage] = useState<string>("chosePlayers");

    return (
        <div className={styles.container}>
            {page === "chosePlayers" && <EntreInfos setPage={setPage} />}
            {page === "map" && <MapLocal setPage={setPage}></MapLocal>}
            {(page === "startedGame" && localTournementNames.length === 4) && <RoundOne setPage={setPage}></RoundOne>}
            {(page === "startedGame" && localTournementNames.length === 5) && <RoundTwo setPage={setPage}></RoundTwo>}
            {(page === "startedGame" && localTournementNames.length === 6) && <RoundTree setPage={setPage}></RoundTree>}


        </div>
    );
};

export default Tournament;

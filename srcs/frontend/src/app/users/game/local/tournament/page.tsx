"use client";
import { useState } from "react";

import EntreInfos from "@/components/tournement/localTournement/EntreInfos/EntreInfos";
import { useUserContext } from "@/context/UserContext";
import styles from './EntreInfos.module.css'
import MapLocal from "@/components/tournement/localTournement/MapLocal/MapLocal";
import GameComponent from "@/app/users/gameArenaLocal/page";



const RoundOne = ({setPage}) =>{
    const {
        localTournementNames,
        setLocalTournementNames
    } = useUserContext();

    const handlePlayerWins = (winnerName: string) => {
    const handlePlayerWins = (winnerName: string) => {
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    };
    };

    return (
    return (
        <div className={styles.containerwinnerFstRound}>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[0])}
            >
                winner : {localTournementNames[0]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[1])}
            >
                winner : {localTournementNames[1]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[0])}
            >
                winner : {localTournementNames[0]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[1])}
            >
                winner : {localTournementNames[1]}
            </button>
        </div>
    );
};

const RoundTwo: React.FC<RoundProps> = ({ setPage }) => {
    const { localTournementNames, setLocalTournementNames } = useUserContext();
    );
};

const RoundTwo: React.FC<RoundProps> = ({ setPage }) => {
    const { localTournementNames, setLocalTournementNames } = useUserContext();

    const handlePlayerWins = (winnerName: string) => {
    const handlePlayerWins = (winnerName: string) => {
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    };
    };

    return (
    return (
        <div className={styles.containerwinnerFstRound}>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[2])}
            >
                winner : {localTournementNames[2]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[3])}
            >
                winner : {localTournementNames[3]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[2])}
            >
                winner : {localTournementNames[2]}
            </button>
            <button
                className={styles.PlayBtn}
                onClick={() => handlePlayerWins(localTournementNames[3])}
            >
                winner : {localTournementNames[3]}
            </button>
        </div>
    );
};

const RoundTree: React.FC<RoundProps> = ({ setPage }) => {
    const { localTournementNames, setLocalTournementNames } = useUserContext();
    );
};

const RoundTree: React.FC<RoundProps> = ({ setPage }) => {
    const { localTournementNames, setLocalTournementNames } = useUserContext();

    const handlePlayerWins = (winnerName: string) => {
    const handlePlayerWins = (winnerName: string) => {
        setLocalTournementNames([...localTournementNames, winnerName]);
        setPage("map");
    };
    };

    return (
    return (
        <div className={styles.containerwinnerFstRound}>
        <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[4])}>winner : {localTournementNames[4]}</button>
        <button className={styles.PlayBtn} onClick={() => handlePlayerWins(localTournementNames[5])}>winner : {localTournementNames[5]}</button>
        </div>
    )
}


const Tournament = () => {
    const { localTournementNames } = useUserContext();
    const { localTournementNames } = useUserContext();
    const [page, setPage] = useState<string>("chosePlayers");

    return (
        <div className={styles.container}>
            {page === "chosePlayers" && <EntreInfos setPage={setPage} />}
            {page === "map" && <MapLocal setPage={setPage}></MapLocal>}
            {(page === "startedGame" && localTournementNames.length === 4) && <GameComponent setPage={setPage} player1={localTournementNames[0]} player2={localTournementNames[1]}/>}
            {(page === "startedGame" && localTournementNames.length === 5) && <GameComponent setPage={setPage} player1={localTournementNames[2]} player2={localTournementNames[3]}/>}
            {(page === "startedGame" && localTournementNames.length === 6) && <GameComponent setPage={setPage} player1={localTournementNames[4]} player2={localTournementNames[5]}/>}
        </div>
    );
};

export default Tournament;

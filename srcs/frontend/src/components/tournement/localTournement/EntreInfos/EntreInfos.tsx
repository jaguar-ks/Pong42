"use client"
import { useEffect, useState } from "react";
import styles from './EntreInfos.module.css'
import { useUserContext } from "@/context/UserContext";
const EntreInfos = ({setPage}) =>{

    const {localTournementNames, setLocalTournementNames} = useUserContext();

    useEffect(() => {
        setLocalTournementNames(['','','','']);
    }, []);

    const handleNameChange = (index, value) => {
        const updatedNames = [...localTournementNames];
        updatedNames[index] = value;
        setLocalTournementNames(updatedNames);
    };

    return(
        <div className={styles.container}>


            <div className={styles.playerInputs}>
                <h2 className={styles.title}>Enter Player Names :</h2>
                {localTournementNames.map((name, index) => (
                    <div key={index} className={styles.playerInput}>
                        <label className={styles.label}>Player {index + 1}:</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            placeholder={`Player ${index + 1} Name`}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.startButtonContainer}>
                <button className={styles.startButton} onClick={() => setPage("map")}>Start the game</button>
            </div>
        </div>
    )
}

export default EntreInfos;
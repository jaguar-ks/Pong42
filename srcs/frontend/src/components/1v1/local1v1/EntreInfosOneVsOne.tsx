"use client"
import { useState } from "react";
import styles from './EntreInfosOneVsOne.module.css'
import { useUserContext } from "@/context/UserContext";
const EntreInfosOneVsOne = ({setPage}) =>{

    const {localOneVsOneNames, setLocalOneVsOneNames} = useUserContext();

    const handleNameChange = (name: string, index) => {
        setLocalOneVsOneNames((prevNames) => {
            const updatedNames = [...prevNames]; // Create a copy of the array
            updatedNames[index] = name; // Update the specific index
            return updatedNames; // Return the updated array
        });
    };

    return(
        <div className={styles.container}>
            <div className={styles.playerInputs}>
                <h2 className={styles.title}>Enter Player Names :</h2>
                <div className={styles.plyerInput}>
                    <label className={styles.label}>Player 1:</label>
                    <input
                        className={styles.input}
                        type={localOneVsOneNames[0]}
                        onChange={(e) => handleNameChange(e.target.value, 0)}
                        placeholder={`Player 1 Name`}
                        />
                </div>
                <div className={styles.playerInput}>

                <label className={styles.label}>Player 2:</label>
                <input
                    className={styles.input}
                    type={localOneVsOneNames[1]}
                    onChange={(e) => handleNameChange(e.target.value, 1)}
                    placeholder={`Player 2 Name`}
                />
                </div>
            </div>
            <div className={styles.startButtonContainer}>
                <button className={styles.startButton}>start game</button>
            </div>
        </div>
    )
}

export default EntreInfosOneVsOne;
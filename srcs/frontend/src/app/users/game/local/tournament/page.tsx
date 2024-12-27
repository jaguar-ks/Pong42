"use client";
import { useState } from "react";

import EntreInfos from "@/components/tournement/localTournement/EntreInfos/EntreInfos";
import { useUserContext } from "@/context/UserContext";

import styles from './EntreInfos.module.css'
import MapLocal from "@/components/tournement/localTournement/MapLocal/MapLocal";

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
            {page === "map" && <MapLocal></MapLocal>}
        </div>
    );
};

export default Tournament;

"use client";

import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import EntreInfosOneVsOne from "@/components/1v1/local1v1/EntreInfosOneVsOne";

const OneVsOne = () => {
    const { localOneVsOneNames, setLocalOneVsOneNames } = useUserContext();
    const [page, setPage] = useState<string>("chosePlayers");
    return (
        <div>
            {page === "chosePlayers" && <EntreInfosOneVsOne setPage={setPage} />}
        </div>
    );
};

export default OneVsOne;

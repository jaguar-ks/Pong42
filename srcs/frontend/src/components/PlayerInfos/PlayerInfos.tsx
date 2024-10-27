import React from 'react';
import classes from "./playerInfos.module.css";
import { useUserContext } from '../../context/UserContext'; // Import the custom hook
import TimeDifference from '../TimeDifference/TimeDifference';
import CopyToClipboard from '../CopyToClipboard/CopyToClipboard';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const PlayerInfos = () => {
    const { userData } = useUserContext(); // Destructure userData

    return (
        <div className={classes.playerinfos}>
            <div className={classes.info}>
                <h2 className={classes.title}>username:</h2>
                <div className={classes.infoAndCopy}>
                    <h2 className={classes.title}>
                        {userData?.username ? userData?.username.length > 10 ? `${userData.username.slice(0, 10)}...` : userData.username : "loading"}
                    </h2>
                    <CopyToClipboard textToCopy={userData?.username} width={18} height={18} />
                </div>
            </div>
            <div className={classes.info}>
                <h2 className={classes.title}>id:</h2>
                <div className={classes.infoAndCopy}>
                    <h2 className={classes.title}>
                        {userData?.id ? userData?.id.toString().length > 10 ? `${userData.id.toString().slice(0, 10)}...` : userData.id : "loading"}
                    </h2>
                    <CopyToClipboard textToCopy={userData?.id} width={18} height={18} />
                </div>
            </div>
            <div className={classes.info}>
                <h2 className={classes.title}>status: </h2>
                <div className={classes.infoAndCopy}>
                    <h2 className={classes.title}>{userData?.username ? (userData.is_active ? "Online" : "Offline") : "loading"}</h2>
                </div>
            </div>
            {!userData.is_active && (
                <div className={classes.info}>
                    <h2 className={classes.title}>last seen: </h2>
                    <h2 className={classes.title}><TimeDifference timestamp={userData.last_login} /></h2>
                </div>
            )}
            <div className={classes.info}>
                <h2 className={classes.title}>email: </h2>
                <div className={classes.infoAndCopy}>
                    <h2 className={classes.title}>
                        {userData?.email ? userData?.email.length > 10 ? `${userData.email.slice(0, 10)}...` : userData.email : "loading"}
                    </h2>
                    <CopyToClipboard textToCopy={userData?.email} width={18} height={18} />
                </div>
            </div>
        </div>
    );
};

export default PlayerInfos;

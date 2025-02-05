
import classes from "./PlayerInfosFr.module.css";
import { useUserContext } from '../../../context/UserContext';
import CopyToClipboard from '../../CopyToClipboard/CopyToClipboard';
import Image from 'next/image';





const PlayerInfosFr = () => {
    const { searchedUserData } = useUserContext();
    return (
        <div className={classes.playerinfos}>
            <div className={classes.imageC}>
                <Image className={classes.image} src={searchedUserData.avatar_url ? searchedUserData.avatar_url : process.env.NEXT_PUBLIC_DEFAULT_AVATAR } alt='avatar' width={100} height={100}/>
            </div>
            <div className={classes.infosContainer}>
                <div className={classes.info}>
                    <h2 className={classes.title}>username:</h2>
                    <div className={classes.infoAndCopy}>
                        <h2 className={classes.title}>
                            {searchedUserData?.username ? searchedUserData?.username.length > 10 ? `${searchedUserData.username.slice(0, 10)}...` : searchedUserData.username : "loading"}
                        </h2>
                        <CopyToClipboard textToCopy={searchedUserData?.username} width={18} height={18} />
                    </div>
                </div>
                <div className={classes.info}>
                    <h2 className={classes.title}>id:</h2>
                    <div className={classes.infoAndCopy}>
                        <h2 className={classes.title}>
                            {searchedUserData?.id ? searchedUserData?.id.toString().length > 10 ? `${searchedUserData.id.toString().slice(0, 10)}...` : searchedUserData.id : "loading"}
                        </h2>
                        <CopyToClipboard textToCopy={String(searchedUserData?.id)} width={18} height={18} />
                    </div>
                </div>
                <div className={classes.info}>
                    <h2 className={classes.title}>status: </h2>
                    <div className={classes.infoAndCopy}>
                        <h2 className={classes.title}>{searchedUserData?.username ? (searchedUserData.is_online ? "Online" : "Offline") : "loading"}</h2>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default PlayerInfosFr;

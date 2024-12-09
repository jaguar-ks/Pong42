import React from 'react';
import Image from 'next/image';
import classes from './Profile.module.css';
import { useUserContext } from '@/context/UserContext';
import settingsIcon from '../../../../assets/settingsIcon.svg'
import settingsIconBlack from '../../../../assets/SettingsBlack.svg'
import logoutIcon from '../../../../assets/LogoutBlack.svg'

interface ProfileProps {
  username: string;
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const {userData, updateCurrentPage,updateSearchedUserData } = useUserContext();

  return (
    <div className={classes.dropdownContent}>
      <div className={classes.profileHeader}>
        <Image src={userData.avatar_url ||  "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} alt={username} width={60} height={60} className={classes.profileImage} />
        <div className={classes.profileInfo}>
          <p className={classes.username}>{username}</p>
          <span className={classes.viewProfile}>View Profile</span>
        </div>
      </div>
      <div className={classes.profileActions}>
        <button className={classes.profileButton}>
          <Image src={settingsIconBlack} alt="Settings" width={20} height={20} />
          Settings
        </button>
        <button className={classes.profileButton}>
          <Image src={logoutIcon} alt="Logout" width={20} height={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;


import React from 'react';
import Image from 'next/image';
import classes from './Profile.module.css';
import { useUserContext } from '@/context/UserContext';
import settingsIcon from '../../../../assets/settingsIcon.svg'
import settingsIconBlack from '../../../../assets/SettingsBlack.svg'
import logoutIcon from '../../../../assets/LogoutBlack.svg'
import { useRouter } from 'next/navigation'

interface ProfileProps {
  username: string;
}

const Profile: React.FC<ProfileProps> = ({ username, handleIconToggle }) => {
  const {userData, updateCurrentPage,updateSearchedUserData } = useUserContext();
  const router = useRouter();

  const handleGosettings = () =>{
    updateCurrentPage("");
    handleIconToggle("");
    router.push('/users/settings');

  }
  const handlelLogout = () =>{
    updateCurrentPage("");
    handleIconToggle("");
    router.push('/users/logout');
  }
  const handleViewProfile = () =>{
    updateCurrentPage("");
    handleIconToggle("");
    router.push('/users/home');
  }

  return (
    <div className={classes.dropdownContent}>
      <div className={classes.profileHeader}>
        <Image src={userData.avatar_url ||  "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} alt={username} width={60} height={60} className={classes.profileImage} />
        <div className={classes.profileInfo}>
          <p className={classes.username}>{username}</p>
          <span className={classes.viewProfile} onClick={handleViewProfile}>View Profile</span>
        </div>
      </div>
      <div className={classes.profileActions}>
        <button className={classes.profileButton} onClick={handleGosettings}>
          <Image src={settingsIconBlack} alt="Settings" width={20} height={20} />
          Settings
        </button>
        <button className={classes.profileButton} onClick={handlelLogout}>
          <Image src={logoutIcon} alt="Logout" width={20} height={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;


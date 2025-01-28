import React from 'react';
import Image from 'next/image';
import classes from './Profile.module.css';
import { useUserContext } from '@/context/UserContext';
import settingsIconBlack from '../../../../assets/SettingsBlack.svg';
import logoutIcon from '../../../../assets/LogoutBlack.svg';
import { useRouter } from 'next/navigation';

interface ProfileProps {
  username: string;
  setActiveIcon: React.Dispatch<React.SetStateAction<string>>; // Updated type
}

const Profile: React.FC<ProfileProps> = ({ username, setActiveIcon }) => {
  const { userData, updateCurrentPage } = useUserContext();
  const router = useRouter();

  const handleGoSettings = () => {
    updateCurrentPage("");
    setActiveIcon(""); // Close the profile dropdown
    router.push('/users/settings');
  };

  const handleLogout = () => {
    updateCurrentPage("");
    setActiveIcon(""); // Close the profile dropdown
    router.push('/users/logout');
  };

  const handleViewProfile = () => {
    updateCurrentPage("");
    setActiveIcon(""); // Close the profile dropdown
    router.push('/users/home');
  };

  return (
    <div className={classes.dropdownContent}>
      <div className={classes.profileHeader}>
        <Image
          src={userData.avatar_url || "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"}
          alt={username}
          width={60}
          height={60}
          className={classes.profileImage}
        />
        <div className={classes.profileInfo}>
          <p className={classes.username}>{username}</p>
          <span className={classes.viewProfile} onClick={handleViewProfile}>View Profile</span>
        </div>
      </div>
      <div className={classes.profileActions}>
        <button className={classes.profileButton} onClick={handleGoSettings}>
          <Image src={settingsIconBlack} alt="Settings" width={20} height={20} />
          Settings
        </button>
        <button className={classes.profileButton} onClick={handleLogout}>
          <Image src={logoutIcon} alt="Logout" width={20} height={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

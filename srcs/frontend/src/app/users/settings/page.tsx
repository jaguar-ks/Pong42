"use client";
import * as React from 'react';
import classes from './Settings.module.css';
import ChangeUsername from '../../../components/Settings/ChangeUsername/ChangeUsername';
import ChangeFirstname from '../../../components/Settings/ChangeFirstname/ChangeFirstname';
import ChangeLastname from '../../../components/Settings/ChangeLastname/ChangeLastname';
import ChangePassword from '../../../components/Settings/ChangePassword/ChangePassword';
import avatare from '../../../../assets/player.png'
// import { UserContext } from "@/app/context/UserContext";
import axios from 'axios';
import Image from 'next/image';
import ChangeTFA from '../../../components/Settings/ChangeTFA/ChangeTFA';
// import loadMyData from '@/Components/LoadMyData';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../components/Settings/ChangeImage/ImageUpload';
import { UserContext, useUserContext } from '@/context/UserContext';

const Settings: React.FC = () => {

  const [currentPage, setCurrentPage] = React.useState("");
  const router = useRouter();
  const { userData } = useUserContext();
  const {updateUserData, updateCurrentPage } = useUserContext();

  React.useEffect(() => {
    updateCurrentPage("settings");
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/", { withCredentials: true });
        console.log(res.data);
        
        // console.log(res.data.avatar_url);
        updateUserData({
          id: res.data.id,
          otp_uri: res.data.otp_uri,
          last_login: res.data.last_login,
          is_superuser: res.data.is_superuser,
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          is_staff: res.data.is_staff,
          is_active: res.data.is_active,
          date_joined: res.data.date_joined,
          two_fa_enabled: res.data.two_fa_enabled,
          is_online: res.data.is_online,
          avatar_url: res.data.avatar_url,
          wins: res.data.wins,
          loses: res.data.loses,
          rating: res.data.rating,
          rank: res.data.rank,
        })

      } catch (err: any) {
        console.log("Error in fetching user data", err);
      } finally {
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    updateCurrentPage("settings");

  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.SettingsContainer}>
        <div className={classes.Settings}>
          <div className={classes.settingsOverlay}>
            <h1 className={classes.editProfileTitle}>Edit your profile</h1>
            <div className={classes.editContainer} onClick={() => setCurrentPage("avatar")}>
              <label className={classes.label} htmlFor="Avatar">Avatar:</label>
              <div className={classes.imageProvisoir} >
                <Image alt='Avatar' src={userData.avatar_url ? userData.avatar_url : "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} width={100} height={100} className={classes.image}></Image>
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>
            <div className={classes.editContainer} onClick={() => setCurrentPage("username")}>
              {/* Username Input with Label */}
              <label className={classes.label} htmlFor="usernameInput">Username:</label>
              <div className={classes.inputProvisoirContainer}>
                <input
                  id="usernameInput"
                  disabled={true}
                  className={classes.inputProvisoir}
                  value={userData.username}
                  />
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>

            <div className={classes.editContainer} onClick={() => setCurrentPage("password")}>
              {/* Password Input with Label */}
              <label className={classes.label} htmlFor="passwordInput">Password:</label>
              <div className={classes.inputProvisoirContainer}>
                <input
                  id="passwordInput"
                  disabled={true}
                  className={classes.inputProvisoir}
                  value="******"
                />
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>

            <div className={classes.editContainer} onClick={() => setCurrentPage("firstname")}>
              <label className={classes.label} htmlFor="firstnameInput">First Name:</label>
              <div className={classes.inputProvisoirContainer}>
                <input
                  id="firstnameInput"
                  disabled={true}
                  className={classes.inputProvisoir}
                  value={userData.first_name}
                  />
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>
            <div className={classes.editContainer} onClick={() => setCurrentPage("TFA")}>
              <label className={classes.label} htmlFor="TFA">TFA:</label>
              <div className={classes.inputProvisoirContainer}>
                <input
                  id="TFA"
                  disabled={true}
                  className={classes.inputProvisoir}
                  value={`2FA now is ${userData.two_fa_enabled ? "ON" : "OFF"}`}
                  />
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>

            <div className={classes.editContainer} onClick={() => setCurrentPage("lastname")}>
              {/* Last Name Input with Label */}
              <label className={classes.label} htmlFor="lastnameInput">Last Name:</label>
              <div className={classes.inputProvisoirContainer}>
                <input
                  id="lastnameInput"
                  disabled={true}
                  className={classes.inputProvisoir}
                  value={userData.last_name}
                  />
              </div>
              <button className={classes.editButton}>Edit</button>
            </div>
            {currentPage === "avatar" && <ImageUpload setCurrentPage={setCurrentPage}/>}
            {currentPage === "username" && <ChangeUsername setCurrentPage={setCurrentPage} />}
            {currentPage === "password" && <ChangePassword setCurrentPage={setCurrentPage} />}
            {currentPage === "firstname" && <ChangeFirstname setCurrentPage={setCurrentPage} />}
            {currentPage === "lastname" && <ChangeLastname setCurrentPage={setCurrentPage} />}
            {currentPage === "TFA" && <ChangeTFA setCurrentPage={setCurrentPage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
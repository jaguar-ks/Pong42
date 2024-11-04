"use client"
import { useState } from 'react';
import { z } from "zod";
import {schema} from "../../../schemas/validationSchema.ts"
import InputField from '../../../components/InputField/InputField';
import classes from "./page.module.css"
import axios from 'axios';
import { AxiosError } from 'axios';
import Image from 'next/image.js';
import loginPlayer from '../../../../assets/loginPlayer.svg'
import { useRouter } from 'next/navigation';
import OtpForLogin from '../../../components/OtpForLogin/OtpForLogin.tsx';


interface Errors{
  details: string;
  username: string;
  password: string;
  otp: string;
}

const SignUpPage: React.FC = () => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    details: '',
    username: '',
    password: '',
    otp: '',
  });

  const router = useRouter();

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors(() => ({
        details: '', 
        username: '',
        password: '',
        otp: '',
    }));
    setIsLoading(true);
    
    console.log("username:", username);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/sign-in/", {
          "username": username,
          "password": password,
      }, {
          withCredentials: true,
      }).catch(err => {
        console.error("Sign-in error:", err);
      });
  
      if (res.status === 200) { // Check if the response is OK
          router.push("/users/home");
          setIsLoading(false);
      }
    } catch (err) {
        console.error("test");
        console.error("Error response:", err.response);
        setErrors(() => ({
        details: "username of password is not correct",
        username: err.response?.data?.username ? err.response.data.username[0] : "",
        password: err.response?.data?.password ? err.response.data.password[0] : "",
        otp: err.response?.data?.otp_code[0] ? err.response?.data?.otp_code[0] : "",
      })); 
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
        <h1 className={classes.title}>Login</h1>
        <div className={classes.container2}>
            <div className={classes.leftSide}>
                <p className={classes.welcomeMsg}>Welcome to the Ping Pong World</p>
                <p className={classes.p}>Welcome back! Please login to your account.</p>
                <form className={classes.form} onSubmit={handleSubmit}>
                <InputField
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(event) => {setUsername(event.target.value) ;setErrors(() => ({details: '', username: '',password: '',}));}}
                    error={errors.username}
                />
                <InputField
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => {setPassword(event.target.value) ;setErrors(() => ({details: '', username: '',password: '',}));}}
                    error={errors.password}
                />
                {errors.otp && <OtpForLogin setErrors={setErrors} errors={errors} username={username} password={password}/>}

                <p className={classes.error}>{errors.details}</p>
                <input type='submit' value={!isLoading ? "signin" : "loading"} className={classes.submitButton} disabled={isLoading}/>
                </form>
                <div className={classes.message}>
                  <p>if you dont have an account <button className={classes.link} onClick={() =>  router.push("/auth/signup")}>Sign Up</button></p>
                </div>
            </div>
            <div className={classes.rightSide}>
                <Image className={classes.image} src={loginPlayer} alt="My SVG Image"  />
            </div>
        </div>
    </div>
  );
};

export default SignUpPage;

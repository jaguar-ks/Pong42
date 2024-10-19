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


interface Errors{
  username: string;
  password: string;
}

const SignUpPage: React.FC = () => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    username: '',
    password: '',
  });

  const router = useRouter();

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors(() => ({
        username: '',
        password: '',
    }));
    setIsLoading(true);
    
    console.log("username:", username);
    try {
        
        const res = await axios.post("http://localhost:8000/api/auth/sign-in/",{
            "username": username,
            "password": password,
        });
        console.log("tst");
        router.push("/user/home");
        setIsLoading(false);
    } catch (err) {
        console.error("test");
        console.error("Error response:", err);
        setErrors(() => ({
        username: err.response?.data?.username ? err.response.data.username[0] : "",
        password: err.response?.data?.password ? err.response.data.password[0] : "",
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
                    onChange={(event) => setUsername(event.target.value)}
                    error={errors.username}
                />
                <InputField
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={errors.password}
                />
                <input type='submit' value="sign in" className={classes.submitButton}/>
                </form>
            </div>
            <div className={classes.rightSide}>
                <Image className={classes.image} src={loginPlayer} alt="My SVG Image"  />
            </div>
        </div>
    </div>
  );
};

export default SignUpPage;

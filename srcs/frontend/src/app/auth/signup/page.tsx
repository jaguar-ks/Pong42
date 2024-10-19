"use client"
import { useState } from 'react';
import { z } from "zod";
import {schema} from "../../../schemas/validationSchema.ts"
import InputField from '../../../components/InputField/InputField';
import classes from "./page.module.css"
import axios from 'axios';
import { AxiosError } from 'axios';
import loginPlayer from '../../../../assets/loginPlayer.svg'
import Image from 'next/image.js';
import { useRouter } from 'next/navigation';


interface Errors{
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  confermPassword: string;
}

const SignUpPage: React.FC = () => {

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confermPassword, setConfermPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    confermPassword: '',
  });

  const router = useRouter();


  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors(() => ({
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      confermPassword: '',
    }));
    setIsLoading(true);

    const result = schema.safeParse({firstname, lastname , email , username, password, confermPassword });
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors;
      setErrors(() => ({
        firstname: errorMsg.firstname ? errorMsg.firstname[0] : '',
        lastname: errorMsg.lastname ? errorMsg.lastname[0] : '',
        email: errorMsg.email ? errorMsg.email[0] : '',
        username: errorMsg.username ? errorMsg.username[0] : '',
        password: errorMsg.password ? errorMsg.password[0] : '',
        confermPassword: errorMsg.confermPassword ? errorMsg.confermPassword[0] : '',
      }));
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending data:", { username, password, email, firstname, lastname });

      const res = await axios.post("http://localhost:8000/api/auth/sign-up/",{
        "username": username,
        "password": password,
        "email": email,
        "first_name": firstname,
        "last_name": lastname
      });
      console.log("tst");
      router.push("/auth/signin");

    } catch (err) {
      console.error("Error response:", err.response.data);
      console.error("Error message:", err.message);
      setErrors(() => ({
        firstname: err.response.data.firstname ? err.response.data.firstname[0] : "",
        lastname: err.response.data.lastname ? err.response.data.lastname[0] : "",
        email: err.response.data.email ? err.response.data.email[0] : "",
        username: err.response.data.username ? err.response.data.username[0] : "",
        password: err.response.data.password ? err.response.data.password[0] : "",
        confermPassword: err.response.data.confermPassword ? err.response.data.confermPassword[0] : "",
      })); 

    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>sign up</h1>
        <div className={classes.container2}>
            <div className={classes.leftSide}>
            <p className={classes.welcomeMsg}>Welcome to the Ping Pong World</p>
            <p className={classes.p}>Welcome back! Please create your account.</p>
            <form className={classes.form} onSubmit={handleSubmit}>

              <InputField
                label="Firstname"
                type="text"
                id="fisrtname"
                name="firstname"
                value={firstname}
                onChange={(event) => setFirstname(event.target.value)}
                error={errors.firstname}
              />
              <InputField
                label="Lastname"
                type="text"
                id="lastname"
                name="lastname"
                value={lastname}
                onChange={(event) => setLastname(event.target.value)}
                error={errors.lastname}
              />
              <InputField
                label="Email"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={errors.email}
              />
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
              <InputField
                label="ConfermPassword"
                type="password"
                id="confermPassword"
                name="confermPassword"
                value={confermPassword}
                onChange={(event) => setConfermPassword(event.target.value)}
                error={errors.confermPassword}
              />
              <input type='submit' value="submit" className={classes.submitButton}/>
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

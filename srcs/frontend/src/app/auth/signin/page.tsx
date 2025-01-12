'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { InputField } from '@/components/InputField'
import styles from './page.module.css'
import OtpForLogin from '../../../components/OtpForLogin/OtpForLogin'
import { Header } from '@/components/Header'
import imageee from '../../../../assets/syberPlayer.png'
import googleIcon from '../../../../assets/googleSigninLogoBlack.svg'
import githubIcon from '../../../../assets/githubSignInLogo.svg'
import FTIcon from '../../../../assets/FTSignUnImage1.svg'

interface Errors {
  details: string
  username: string
  password: string
  otp: string
}

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({
    details: '',
    username: '',
    password: '',
    otp: '',
  })

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setErrors({
      details: '',
      username: '',
      password: '',
      otp: '',
    })
    setIsLoading(true)
    
    try {
      await axios.post("http://localhost:8000/api/auth/sign-in/", {username, password}, {withCredentials: true})
      console.log("Success")
      router.push("/users/home")
    } catch (err: any) {
      console.error("Error:", err.response)
      setErrors({
        details: err.response?.data?.detail || "",
        username: err.response?.data?.username?.[0] || "",
        password: err.response?.data?.password?.[0] || "",
        otp: err.response?.data?.otp_code?.[0] || "",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (index: number) => {
    try {
      const res = await axios.get('http://localhost:8000/api/auth/social/providers/')
      console.log(`${res.data.providers[index].provider_name} sign-up clicked`)
      router.push(res.data.providers[index].provider_url);
    } catch (err: any) {
      console.error('Error:', err.response )
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Header forWhat="Sign In"/>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <div className={styles.formSection}>
              <h2 className={styles.subtitle}>Welcome to the Ping Pong World</h2>
              <p className={styles.description}>Please sign in to your account.</p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                  label="username"
                  type="text"
                  id="username"
                  name="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                />
                <InputField
                  label="password"
                  type="password"
                  id="password"
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />
                {errors.details && <p className={styles.error}>{errors.details}</p>}
                <div className={styles.submitContainer}>
                  <div className={styles.submitButtonContainer}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={styles.submitButton}
                    >
                      {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </form>
              <div className={styles.socialButtonsContainer}>
                <button onClick={() => handleSignUp(1)} className={styles.socialButton}>
                  <Image
                    src={googleIcon}
                    alt="Sign in with Google"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
                <button onClick={() => handleSignUp(2)} className={styles.socialButton}>
                  <Image
                    src={githubIcon}
                    alt="Sign in with GitHub"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
                <button onClick={() => handleSignUp(0)} className={styles.socialButton}>
                  <Image
                    src={FTIcon}
                    alt="Sign in with GitHub"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
              </div>
              <p className={styles.signUpText}>
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className={styles.signUpLink}
                >
                  Sign Up
                </button>
              </p>
            </div>
            <div className={styles.imageSection}>
              <div className={styles.containerImage}>
                <div className={styles.ImageContainer}>
                  <Image
                    src={imageee}
                    alt="Login Player"
                    width={500}
                    height={500}
                    className={styles.image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {errors.otp && <OtpForLogin setErrors={setErrors} username={username} password={password} />}
    </div>
  )
}

export default SignInPage


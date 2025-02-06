"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import axios, { type AxiosError } from "axios"
import { InputField } from "@/components/InputField"
import styles from "./page.module.css"
import OtpForLogin from "@/components/OtpForLogin/OtpForLogin"
import { Header } from "@/components/Header"
import imageee from "../../../../assets/syberPlayer.png"
import googleIcon from "../../../../assets/googleSigninLogoBlack.svg"
import githubIcon from "../../../../assets/githubSignInLogo.svg"
import FTIcon from "../../../../assets/FTSignUnImage1.svg"
import Api from "@/lib/api"

interface Errors {
  details: string
  username: string
  password: string
  otp: string
}

interface ErrorResponse {
  detail?: string
  username?: string[]
  password?: string[]
  otp_code?: string[]
}

const SignInContent = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({
    details: "",
    username: "",
    password: "",
    otp: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const social_error = searchParams.get("error")
  const otp_required = searchParams.get("otp_required") === "true"

  useEffect(() => {
    if (otp_required) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }))
    }
  }, [otp_required])

  useEffect(() => {
    if (social_error) {
      setErrors((prev) => ({ ...prev, details: social_error }))
    }
  }, [social_error])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setErrors({
      details: "",
      username: "",
      password: "",
      otp: "",
    })
    setIsLoading(true)

    try {
      await Api.post("/auth/sign-in/", { username, password }, { withCredentials: true })
      router.push("/users/home")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>
        setErrors({
          details: axiosError.response?.data?.detail || "",
          username: axiosError.response?.data?.username?.[0] || "",
          password: axiosError.response?.data?.password?.[0] || "",
          otp: axiosError.response?.data?.otp_code?.[0] || "",
        })
      } else {
        setErrors((prev) => ({ ...prev, details: "An unexpected error occurred" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (index: number) => {
    try {
      const res = await Api.get("auth/social/providers/")
      router.push(res.data.providers[index].provider_url)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>
        setErrors((prev) => ({
          ...prev,
          details: axiosError.response?.data?.detail || "An error occurred during sign up",
        }))
      } else {
        setErrors((prev) => ({ ...prev, details: "An unexpected error occurred during sign up" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Header forWhat="Sign In" />
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
                    <button type="submit" disabled={isLoading} className={styles.submitButton}>
                      {isLoading ? "Loading..." : "Sign In"}
                    </button>
                  </div>
                </div>
              </form>
              <div className={styles.socialButtonsContainer}>
                <button onClick={() => handleSignUp(1)} className={styles.socialButton}>
                  <Image
                    src={googleIcon || "/placeholder.svg"}
                    alt="Sign in with Google"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
                <button onClick={() => handleSignUp(2)} className={styles.socialButton}>
                  <Image
                    src={githubIcon || "/placeholder.svg"}
                    alt="Sign in with GitHub"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
                <button onClick={() => handleSignUp(0)} className={styles.socialButton}>
                  <Image
                    src={FTIcon || "/placeholder.svg"}
                    alt="Sign in with FT"
                    width={40}
                    height={40}
                    className={styles.socialButtonImage}
                  />
                </button>
              </div>
              <p className={styles.signUpText}>
                Dont have an account
                <button onClick={() => router.push("/auth/signup")} className={styles.signUpLink}>
                  Sign Up
                </button>
              </p>
            </div>
            <div className={styles.imageSection}>
              <div className={styles.containerImage}>
                <div className={styles.ImageContainer}>
                  <Image
                    src={imageee || "/placeholder.svg"}
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

const SignInPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignInContent />
  </Suspense>
)

export default SignInPage
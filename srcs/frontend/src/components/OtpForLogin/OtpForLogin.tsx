"use client"
import type React from "react"
import { useState } from "react"
import classes from "./OtpForLogin.module.css"
import axios from "axios"
import { useRouter } from "next/navigation"
import OtpInput from "./OtpInput"

interface OtpForLoginProps {
  setErrors: React.Dispatch<React.SetStateAction<{ details: string; username: string; password: string; otp: string }>>
  username: string
  password: string
}

const OtpForLogin: React.FC<OtpForLoginProps> = ({ setErrors, username, password }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()

  const handleSignin = async (inputCode: string): Promise<void> => {
    setIsLoading(true)
    try {
      await axios.post(
        `http://localhost:8000/api/auth/sign-in/`,
        { username, password, otp_code: inputCode },
        { withCredentials: true },
      )
      router.push("/users/home")
    } catch (err: unknown) {
      // Use a type guard to safely access properties on the error object
      if (axios.isAxiosError(err) && err.response?.data?.otp_code) {
        setError(err.response.data.otp_code[0])
      } else {
        setError("An error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setErrors({
      details: "",
      username: "",
      password: "",
      otp: "",
    })
  }

  return (
    <div className={classes.NotifNotif}>
      <div className={classes.window} onClick={(e) => e.stopPropagation()}>
        <div className={classes.element}>
          <h1>Confirmation code: </h1>
          <OtpInput
            isLoading={isLoading}
            setErrorBack={setError}
            errorback={error}
            onComplete={handleSignin}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  )
}

export default OtpForLogin

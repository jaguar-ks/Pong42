import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import styles from "./OtpInput.module.css"

interface OtpInputProps {
  onComplete: (code: string) => void
  onCancel: () => void
  isLoading: boolean
  setErrorBack: (error: string) => void
  errorback: string | undefined
}

const OtpInput: React.FC<OtpInputProps> = ({ onComplete, onCancel, isLoading, setErrorBack, errorback }) => {
  const [otp, setOtp] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    setError("")
    setErrorBack("")
  }

  const handleSubmit = () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits")
      setErrorBack("")
      return
    }
    onComplete(otp)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Label htmlFor="otp-input">Enter 6-digit OTP</Label>
        <Input
          id="otp-input"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={otp}
          onChange={handleChange}
          placeholder="Enter 6-digit code"
          className={styles.input}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {errorback && <p className={styles.errorText}>{errorback}</p>}
      <div className={styles.buttonContainer}>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}

export default OtpInput


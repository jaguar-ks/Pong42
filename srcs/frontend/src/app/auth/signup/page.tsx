'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { z } from 'zod'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InputField } from '@/components/InputField'
import styles from './page.module.css'
import imageee from '../../../../assets/syberPlayer.png'
import googleIcon from '../../../../assets/googleSigninLogoBlack.svg'
import githubIcon from '../../../../assets/githubSignInLogo.svg'
import FTIcon from '../../../../assets/FTSignUnImage1.svg'

const schema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confermPassword: z.string(),
}).refine((data) => data.password === data.confermPassword, {
  message: "Passwords don't match",
  path: ["confermPassword"],
})

type FormData = z.infer<typeof schema>

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    confermPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData> & { non_field_errors?: string }>({})

  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setIsLoading(true)

    const result = schema.safeParse(formData)
    if(!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      setIsLoading(false)
      return
    }

    try {
      await axios.post('http://localhost:8000/api/auth/sign-up/', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.firstname,
        last_name: formData.lastname,
      })
      setIsSuccess(true)
    } catch (err: any) {
      console.error('Error:', err.response?.data)
      setErrors(err.response?.data || { non_field_errors: 'An error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/auth/social/providers/')
      console.log(res.data.providers[1].provider_url);
      router.push(res.data.providers[1].provider_url);
    } catch (err: any) {
      console.error('Error:', err.response )
      
    } finally {
      setIsLoading(false)
    }
    

    console.log('Google sign-up clicked')
  }

  const handleGithubSignUp = () => {
    // Implement GitHub sign-up logic here
    console.log('GitHub sign-up clicked')
  }

  return (
    <div className={styles.pageContainer}>
      <Header forWhat="Sign Up"/>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <div className={!isSuccess ? styles.formSection : styles.formSectionSuccess}>
              {!isSuccess ? (
                <>
                  <h2 className={styles.subtitle}>Welcome to the Ping Pong World</h2>
                  <p className={styles.description}>Please create your account.</p>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    {Object.entries(formData).map(([key, value]) => (
                      <InputField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        type={key.includes('password') ? 'password' : 'text'}
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        error={errors[key as keyof FormData]}
                      />
                    ))}
                    {errors.non_field_errors && (
                      <p className={styles.errorText}>{errors.non_field_errors}</p>
                    )}
                    <div className={styles.submitContainer}>
                      <div className={styles.submitButtonContainer}>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={styles.submitButton}
                        >
                          {isLoading ? 'Loading...' : 'Sign Up'}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className={styles.socialButtonsContainer}>
                    <button onClick={() => handleSignUp(1)} className={styles.socialButton}>
                      <Image
                        src={googleIcon}
                        alt="Sign up with Google"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                    <button onClick={() => handleSignUp(2)} className={styles.socialButton}>
                      <Image
                        src={githubIcon}
                        alt="Sign up with GitHub"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                    <button onClick={() => handleSignUp(0)} className={styles.socialButton}>
                      <Image
                        src={FTIcon}
                        alt="Sign up with GitHub"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                  </div>
                  <p className={styles.signInText}>
                    Already have an account?{' '}
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className={styles.signInLink}
                    >
                      Sign In
                    </button>
                  </p>
                </>
              ) : (
                <div className={styles.successMessage}>
                  <h2 className={styles.subtitle}>Sign Up Successful!</h2>
                  <p className={styles.description}>Please check your email to validate registration.</p>
                  <div className={styles.submitButtonContainer}>
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className={styles.submitButton}
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!isSuccess && (
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


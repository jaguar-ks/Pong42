'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUserContext } from '@/context/UserContext'
import styles from './EntreInfosOneVsOne.module.css'

export default function UserGameInfoPage({setPage}) {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [user1Image, setUser1Image] = useState('/placeholder.svg?height=100&width=100')
  const [user2Image, setUser2Image] = useState('/placeholder.svg?height=100&width=100')
  const { setLocalOneVsOneNames } = useUserContext();
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()
  const fileInputRef1 = useRef<HTMLInputElement>(null)
  const fileInputRef2 = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    setIsFormValid(user1.trim() !== '' && user2.trim() !== '')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setImage(objectUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setLocalOneVsOneNames([
        `${user1}|${user1Image}`,
        `${user2}|${user2Image}`
      ])
      router.push(`/users/gameArenaLocal`)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Setup</h1>
      <form onSubmit={handleSubmit} className={styles.playerInputs}>
        <div className={styles.playerInput}>
          <label htmlFor="user1" className={styles.label}>
            Player 1:
          </label>
          <input
            id="user1"
            type="text"
            value={user1}
            onChange={(e) => {
              setUser1(e.target.value)
              validateForm()
            }}
            placeholder="Enter Player 1 Nickname"
            className={styles.input}
            required
          />
          <div className={styles.imageUpload}>
            <Image
              src={user1Image || "/placeholder.svg"}
              alt="Player 1 avatar"
              width={100}
              height={100}
              className={styles.avatar}
            />
            <button
              type="button"
              onClick={() => fileInputRef1.current?.click()}
              className={styles.uploadButton}
            >
              Upload Image
            </button>
            <input
              ref={fileInputRef1}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setUser1Image)}
              className={styles.hiddenInput}
            />
          </div>
        </div>
        <div className={styles.playerInput}>
          <label htmlFor="user2" className={styles.label}>
            Player 2:
          </label>
          <input
            id="user2"
            type="text"
            value={user2}
            onChange={(e) => {
              setUser2(e.target.value)
              validateForm()
            }}
            placeholder="Enter Player 2 Nickname"
            className={styles.input}
            required
          />
          <div className={styles.imageUpload}>
            <Image
              src={user2Image || "/placeholder.svg"}
              alt="Player 2 avatar"
              width={100}
              height={100}
              className={styles.avatar}
            />
            <button
              type="button"
              onClick={() => fileInputRef2.current?.click()}
              className={styles.uploadButton}
            >
              Upload Image
            </button>
            <input
              ref={fileInputRef2}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setUser2Image)}
              className={styles.hiddenInput}
            />
          </div>
        </div>
        <div className={styles.startButtonContainer}>
          <button
            type="submit"
            className={styles.startButton}
            disabled={!isFormValid}
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  )
}


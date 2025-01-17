'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'
import styles from './EntreInfosOneVsOne.module.css'

export default function UserGameInfoPage({setPage}) {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const { localOneVsOneNames, setLocalOneVsOneNames } = useUserContext();
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()

  // Validate form and update isFormValid state
  const validateForm = () => {
    setIsFormValid(user1.trim() !== '' && user2.trim() !== '')
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setLocalOneVsOneNames({ user1, user2 })
      // router.push(`/users/gameArena`)
      console.log("the game will start");
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


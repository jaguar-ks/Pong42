"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useUserContext } from "@/context/UserContext"
import styles from "./imageUpload.module.css"
import Api from "@/lib/api"

interface ImageUploadProps {
  setCurrentPage: (page: string) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setCurrentPage }) => {
  const [newImage, setNewImage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userData, updateUserData } = useUserContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Api.get("/users/me/")
        setNewImage(res.data.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR)
      } catch (error: unknown) {
        console.log("Error in fetching user data", error)
      }
    }

    fetchData()
  }, [])

  const validateImage = (file: File) => {
    const validTypes: string[] = ["image/jpeg", "image/png", "image/gif"]
    const maxSize: number = 2 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, and GIF are allowed.")
      return false
    }

    if (file.size > maxSize) {
      setError("File size exceeds 2MB.")
      return false
    }

    setError("")
    return true
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files
    if (files && files.length > 0) {
      const file: File = files[0]

      if (!validateImage(file)) return

      setIsLoading(true)
      const data: FormData = new FormData()
      data.append("file", file)
      data.append("upload_preset", "estate")

      try {
        const res: Response = await fetch(`https://api.cloudinary.com/v1_1/doufu6atn/image/upload`, {
          method: "POST",
          body: data,
        })
        const fileData: { secure_url: string } = await res.json()
        setNewImage(fileData.secure_url)
      } catch (error: unknown) {
        setError("Failed to upload image. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChangeAvatar = async () => {
    if (!newImage) {
      setError("Please upload a new image first.")
      return
    }

    setIsLoading(true)
    try {
      const res: { data: { avatar_url: string } } = await Api.patch(
        "/users/me/",
        {
          avatar_url: newImage,
        },
        { withCredentials: true },
      )
      console.log(res.data)
      updateUserData({ ...userData, avatar_url: newImage })
      setCurrentPage("")
    } catch (error: unknown) {
      setError("Failed to update avatar. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setCurrentPage("")
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Change Profile Picture</h2>
          <div className={styles.form}>
            <Image
              className={styles.avatar}
              alt="Avatar"
              src={newImage || userData.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              width={100}
              height={100}
            />
            <input type="file" name="file" onChange={uploadImage} disabled={isLoading} className={styles.input} />
            {error && <span className={styles.error}>{error}</span>}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleChangeAvatar} disabled={isLoading || !newImage}>
                {isLoading ? "Updating..." : "Update"}
              </button>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setCurrentPage("")}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload


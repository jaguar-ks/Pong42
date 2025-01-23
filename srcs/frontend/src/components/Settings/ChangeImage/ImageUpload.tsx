'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import styles from './imageUpload.module.css';

interface ImageUploadProps {
  setCurrentPage: (page: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setCurrentPage }) => {
  const [newImage, setNewImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://localhost/api/users/me/");
        setNewImage(res.data.avatar_url || "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png");
      } catch (err: any) {
        console.log("Error in fetching user data", err);
      }
    };

    fetchData();
  }, []);

  const validateImage = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, and GIF are allowed.");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 2MB.");
      return false;
    }

    setError("");
    return true;
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (!validateImage(file)) return;

      setIsLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "estate");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/doufu6atn/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const fileData = await res.json();
        setNewImage(fileData.secure_url);
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Failed to upload image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangeAvatar = async () => {
    if (!newImage) {
      setError("Please upload a new image first.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        "https://localhost/api/users/me/",
        {
          avatar_url: newImage,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      updateUserData({...userData, avatar_url: newImage});
      setCurrentPage("");
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Failed to update avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setCurrentPage("");
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Change Profile Picture</h2>
          <div className={styles.form}>
            <Image 
              className="rounded-full mx-auto mb-4"
              alt="Avatar" 
              src={newImage || userData.avatar_url || "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} 
              width={100} 
              height={100} 
            />
            <input
              type="file"
              name="file"
              onChange={uploadImage}
              disabled={isLoading}
              className={styles.input}
            />
            {error && <span className={styles.error}>{error}</span>}
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={handleChangeAvatar}
                disabled={isLoading || !newImage}
              >
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
  );
};

export default ImageUpload;


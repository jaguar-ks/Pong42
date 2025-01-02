"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserGameInfoPage() {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
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
        router.push(`/users/gameArena`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">Game Setup</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="user1" className="text-sm font-medium text-gray-700">
              Player 1 Nickname
            </Label>
            <Input
              id="user1"
              type="text"
              value={user1}
              onChange={(e) => {
                setUser1(e.target.value)
                validateForm()
              }}
              placeholder="Enter Player 1 Nickname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user2" className="text-sm font-medium text-gray-700">
              Player 2 Nickname
            </Label>
            <Input
              id="user2"
              type="text"
              value={user2}
              onChange={(e) => {
                setUser2(e.target.value)
                validateForm()
              }}
              placeholder="Enter Player 2 Nickname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!isFormValid}
          >
            Start Game
          </Button>
        </form>
      </div>
    </div>
  )
}


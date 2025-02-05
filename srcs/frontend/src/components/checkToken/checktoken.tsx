import Api from "@/lib/api"
import axios from "axios"

export const checkToken = async (): Promise<boolean> => {
  try {
    // Use the test_auth endpoint to verify authentication
    await Api.get("/auth/test_auth/", { withCredentials: true })
    return true
  } catch (err) {
    console.log("Token validation error:", err)
    return false
  }
}


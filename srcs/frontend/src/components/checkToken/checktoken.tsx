import axios from "axios"

export const checkToken = async (): Promise<boolean> => {
  try {
    // Use the test_auth endpoint to verify authentication
    await axios.get("http://localhost:8000/api/auth/test_auth/", { withCredentials: true })
    return true
  } catch (err) {
    console.log("Token validation error:", err)
    return false
  }
}


import axios from "axios";
import { UserConnection } from "../types";

export const fetchUserConnections = async (
  setRequests: React.Dispatch<React.SetStateAction<UserConnection[]>>,
  setBlocked: React.Dispatch<React.SetStateAction<UserConnection[]>>,
  setFriends: React.Dispatch<React.SetStateAction<UserConnection[]>>
) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/users/me/connections/`, {
      withCredentials: true,
    });
    setRequests(res.data.results.filter((item: UserConnection) => item.status === "incoming_request"));
    setBlocked(res.data.results.filter((item: UserConnection) => item.status === "blocked"));
    setFriends(res.data.results.filter((item: UserConnection) => item.status === "friends"));
  } catch (err) {
    console.error("Error in fetching user data", err);
  }
};


import axios from "axios";

export const fetchUserData = async (userId) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/users/editUsers",
      { id: userId },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    console.error("Issue fetching user data:", error);
    throw error;
  }
};

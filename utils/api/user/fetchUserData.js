import axios from "axios";

export const fetchUserData = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/users/editUsers`,
      { id: userId },
      {
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Issue fetching user data:", error);
    throw error;
  }
};

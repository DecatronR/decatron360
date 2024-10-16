import axios from "axios";

export const fetchFavoriteProperties = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/favorite/getMyFavorites`,
      { userId },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching favourite properties:", error);
    throw error;
  }
};

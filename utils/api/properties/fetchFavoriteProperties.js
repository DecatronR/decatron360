import axios from "axios";

export const fetchFavoriteProperties = async (userId) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/favorite/getMyFavorites",
      { userId },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching favourite properties:", error);
    throw error;
  }
};

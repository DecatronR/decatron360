import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchMyFavorites = async (userId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${baseUrl}/favorite/getMyFavorites`,

      { userId: userId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

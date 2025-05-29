import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getMyFavorites = async (userId) => {
  try {
    const response = await axios.post(`${baseUrl}/favorites/getMyFavorites`, {
      userId: userId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

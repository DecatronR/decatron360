import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const deleteFavorite = async (favoriteId) => {
  try {
    const response = await axios.post(`${baseUrl}/favorites/deleteData`, {
      id: favoriteId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

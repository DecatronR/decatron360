import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const deleteFavorite = async (favoriteId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${baseUrl}/favorite/deleteData`,
      {
        id: favoriteId,
      },
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

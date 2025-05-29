import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createFavorite = async (userId, propertyListingId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${baseUrl}/favorite/createFavorite`,
      {
        userId: userId,
        propertyListingId: propertyListingId,
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

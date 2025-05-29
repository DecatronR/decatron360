import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createFavorite = async (userId, propertyListingId) => {
  try {
    const response = await axios.post(`${baseUrl}/favorites/createFavorite`, {
      userId: userId,
      propertyListingId: propertyListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

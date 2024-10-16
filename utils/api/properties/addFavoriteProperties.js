import axios from "axios";

export const addFavoriteProperties = async (userId, propertyListingId) => {
  const baseUrl = process.env.BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/favorite/createFavorite`,
      { userId, propertyListingId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to favourite properties:", error);
    throw error;
  }
};

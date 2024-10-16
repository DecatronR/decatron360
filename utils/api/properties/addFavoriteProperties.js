import axios from "axios";

export const addFavoriteProperties = async (userId, propertyListingId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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

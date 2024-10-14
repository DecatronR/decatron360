import axios from "axios";

export const addFavoriteProperties = async (userId, propertyListingId) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/favorite/createFavorite",
      { userId, propertyListingId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to favourite properties:", error);
    throw error;
  }
};

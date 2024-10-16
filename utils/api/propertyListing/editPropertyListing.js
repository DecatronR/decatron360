import axios from "axios";

export const editPropertyListing = async (propertyId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/propertyListing/editPropertyListing`,
      { id: propertyId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to edit property listing:", error);
    throw error;
  }
};

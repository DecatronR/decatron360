import axios from "axios";

export const deletePropertyListing = async (propertyId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/propertyListing/deletePropertyListing`,
      { id: propertyId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to delete property listing:", error);
    throw error;
  }
};

import axios from "axios";

export const deletePropertyListing = async (propertyId) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/propertyListing/deletePropertyListing",
      { id: propertyId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to delete property listing:", error);
    throw error;
  }
};

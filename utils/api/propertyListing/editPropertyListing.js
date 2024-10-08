import axios from "axios";

export const editPropertyListing = async (propertyId) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/propertyListing/editPropertyListing",
      { id: propertyId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to edit property listing:", error);
    throw error;
  }
};

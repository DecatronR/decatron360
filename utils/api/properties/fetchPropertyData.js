import axios from "axios";

export const fetchPropertyData = async (propertyId) => {
  if (!propertyId) {
    throw new Error("property ID is required to fetch single property data");
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/propertyListing/editPropertyListing",
      { id: propertyId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching single property data:", error);
    throw error;
  }
};

import axios from "axios";

export const fetchProperties = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8080/propertyListing/fetchPropertyListing",
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

import axios from "axios";

export const fetchProperties = async () => {
  const baseUrl = process.env.BASE_URL;
  try {
    const res = await axios.get(
      `${baseUrl}/propertyListing/fetchPropertyListing`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

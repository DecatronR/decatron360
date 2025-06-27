import axios from "axios";

export const fetchListingTypes = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/listingType/fetchListingType`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching listing types:", error);
    throw error;
  }
};

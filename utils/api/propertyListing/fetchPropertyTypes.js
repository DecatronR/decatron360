import axios from "axios";

export const fetchPropertyTypes = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/propertyType/fetchPropertyType`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching property types:", error);
    throw error;
  }
};

import axios from "axios";

export const fetchPropertyTypes = async () => {
  const baseUrl = process.env.BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/propertyType/fetchPropertyType`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching favourite properties:", error);
    throw error;
  }
};
import axios from "axios";

export const fetchPropertyConditions = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(
      `${baseUrl}/propertyCondition/fetchPropertyCondition`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching property conditions:", error);
    throw error;
  }
};

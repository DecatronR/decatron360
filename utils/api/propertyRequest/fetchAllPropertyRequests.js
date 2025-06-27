import axios from "axios";

export const fetchAllPropertyRequests = async (params = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error(
      "Authentication token is required to fetch property requests."
    );
  }
  try {
    const res = await axios.get(`${baseUrl}/propertyRequest`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all property requests:", error);
    throw error;
  }
};

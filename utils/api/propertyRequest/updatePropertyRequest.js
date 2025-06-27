import axios from "axios";

export const updatePropertyRequest = async (id, data) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.patch(`${baseUrl}/propertRequest/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating property request:", error);
    throw error;
  }
};

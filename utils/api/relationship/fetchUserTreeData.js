import axios from "axios";

export const fetchUserTreeData = async (id) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.post(
      `${baseUrl}/users/userTree`,
      { id },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching favourite properties:", error);
    throw error;
  }
};

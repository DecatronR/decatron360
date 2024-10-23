import axios from "axios";

export const updateUserData = async (userData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  const updateUserConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/update`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data: userData,
    withCredentials: true,
  };
  try {
    const res = await axios(updateUserConfig);
    return res.data.user;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

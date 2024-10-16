import axios from "axios";

export const updateUserData = async (userData) => {
  const updateUserConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/update`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: userData,
    withCredentials: true,
  };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios(updateUserConfig);
    return res.data.user;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

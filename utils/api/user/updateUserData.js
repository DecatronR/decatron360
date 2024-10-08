import axios from "axios";

export const updateUserData = async (userData) => {
  const updateUserConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/users/update",
    headers: {
      "Content-Type": "multipart/form-data", // set to multipart for file upload
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

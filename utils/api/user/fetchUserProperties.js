import axios from "axios";

export const fetchUserProperties = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!userId) {
    throw new Error("User ID is required to fetch properties");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/propertyListing/myProperty`,
      { userID: userId },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching user properties:", error);
    throw error;
  }
};

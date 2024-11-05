import axios from "axios";

export const fetchUserRating = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!userId) {
    throw new Error("User ID is required to fetch rating");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/users/fetchUserRating`,
      { userID: userId },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching user rating:", error);
    throw error;
  }
};

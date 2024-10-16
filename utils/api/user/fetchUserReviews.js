import axios from "axios";

export const fetchUserReviews = async (userId) => {
  const baseUrl = process.env.BASE_URL;
  if (!userId) {
    throw new Error("User ID is required to fetch reviews");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/review/getReview`,
      { userID: userId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching user reviews:", error);
    throw error;
  }
};

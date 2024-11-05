import axios from "axios";

export const fetchUserReviews = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  if (!userId) {
    throw new Error("User ID is required to fetch reviews");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/review/getReview`,
      { userID: userId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching user reviews:", error);
    throw error;
  }
};

import axios from "axios";

export const rateAndReviewUser = async (
  userID,
  rating,
  reviewerID,
  comment
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    await axios.post(
      `${baseUrl}/users/rateUser`,
      { userID, rating, reviewerID, comment },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error with submitting user feedback:", error);
    throw error;
  }
};

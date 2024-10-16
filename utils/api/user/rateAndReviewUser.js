import axios from "axios";

export const rateAndReviewUser = async (
  userID,
  rating,
  reviewerID,
  comment
) => {
  const baseUrl = process.env.BASE_URL;
  try {
    await axios.post(
      `${baseUrl}/users/rateUser`,
      { userID, rating, reviewerID, comment },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error with submitting user feedback:", error);
    throw error;
  }
};

import axios from "axios";

export const rateAndReviewUser = async (
  userID,
  rating,
  reviewerID,
  comment
) => {
  try {
    await axios.post(
      "http://localhost:8080/users/rateUser",
      { userID, rating, reviewerID, comment },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error with submitting user feedback:", error);
    throw error;
  }
};

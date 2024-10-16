import axios from "axios";

export const bookInspection = async (
  userID,
  propertyID,
  agentID,
  bookingDateTime
) => {
  const baseUrl = process.env.BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/booking/book`,
      { userID, propertyID, agentID, bookingDateTime },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to book inspection:", error);
    throw error;
  }
};

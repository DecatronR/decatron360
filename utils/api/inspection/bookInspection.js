import axios from "axios";

export const bookInspection = async (
  userID,
  propertyID,
  agentID,
  bookingDateTime
) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/booking/book",
      { userID, propertyID, agentID, bookingDateTime },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to book inspection:", error);
    throw error;
  }
};

import axios from "axios";

export const fetchAgentBookings = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!userId) {
    throw new Error("User ID is required to fetch agentbookings");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/booking/getAgentBooking`,
      { agentID: userId },
      { withCredentials: true }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed fetching agent bookings:", error);
    throw error;
  }
};

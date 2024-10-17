import axios from "axios";

export const fetchBookingData = async (bookingId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!bookingId) {
    throw new Error("Booking id is required to fetch booking");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/booking/booking`,
      { id: bookingId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching booking:", error);
    throw error;
  }
};

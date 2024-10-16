import axios from "axios";

export const updateBooking = async (bookingId, bookingData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!bookingId) {
    throw new Error("Booking id is required to update booking");
  }

  if (!bookingData) {
    throw new Error("Booking data is required to update booking");
  }

  try {
    const res = await axios.put(
      `${baseUrl}/bookings/${bookingId}`,
      bookingData,
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed updating booking:", error);
    throw error;
  }
};

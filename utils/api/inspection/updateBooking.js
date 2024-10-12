import axios from "axios";

export const updateBooking = async (bookingId, bookingData) => {
  if (!bookingId) {
    throw new Error("Booking id is required to update booking");
  }

  if (!bookingData) {
    throw new Error("Booking data is required to update booking");
  }

  try {
    const res = await axios.put(
      `http://localhost:8080/bookings/${bookingId}`,
      bookingData,
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed updating booking:", error);
    throw error;
  }
};

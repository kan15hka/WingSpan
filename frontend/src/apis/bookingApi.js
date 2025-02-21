import { axiosInstance } from "./axiosInstance";

export const bookFlight = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/book_flight", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error booking flight:", error);
    throw error.response?.data?.message || "Failed to book flight";
  }
};

export const getFlightBookings = async (flightId) => {
  try {
    const response = await axiosInstance.get(`/flight_bookings/${flightId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting flight booking:", error);
    throw error.response?.data?.message || "Failed to fetch flight bookings.";
  }
};

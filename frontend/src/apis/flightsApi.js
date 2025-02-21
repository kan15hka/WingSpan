import { axiosInstance } from "./axiosInstance";

export const getFlights = async () => {
  try {
    const response = await axiosInstance.get("/get_flights");
    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};
export const addFlight = async (data) => {
  try {
    const response = await axiosInstance.post("/add_flight", data);

    return response.data;
  } catch (error) {
    console.error("Error adding flight:", error);
    throw error.response?.data?.message || "Failed to add flight";
  }
};

export const deleteFlight = async (flightId) => {
  try {
    const response = await axiosInstance.delete(`/delete_flight/${flightId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flight:", error);
    throw error.response?.data?.message || "Failed to deleted flight";
  }
};

export const editFlight = async (data, flightId) => {
  try {
    const response = await axiosInstance.put(`/edit_flight/${flightId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error editing flight:", error);
    throw error.response?.data?.message || "Failed to edit flight";
  }
};

export const getPassengerFlights = async () => {
  try {
    const response = await axiosInstance.get("/pass_get_flights");
    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

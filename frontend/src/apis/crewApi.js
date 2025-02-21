import { axiosInstance } from "./axiosInstance";

export const getCrew = async () => {
  try {
    const response = await axiosInstance.get("/get_crew");
    return response.data;
  } catch (error) {
    console.error("Error fetching crew:", error);
    throw error;
  }
};

export const addCrew = async (data) => {
  try {
    const response = await axiosInstance.post("/add_crew", data);

    return response.data;
  } catch (error) {
    console.error("Error adding crew:", error);
    throw error.response?.data?.message || "Failed to add crew";
  }
};

export const editCrew = async (data, crew_id) => {
  try {
    const response = await axiosInstance.put(`/edit_crew/${crew_id}`, data);

    return response.data;
  } catch (error) {
    console.error("Error editing crew:", error);
    throw error.response?.data?.message || "Failed to edit crew";
  }
};

export const deleteCrew = async (crew_id) => {
  try {
    const response = await axiosInstance.delete(`/delete_crew/${crew_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting crew:", error);
    throw error.response?.data?.message || "Failed to delete crew";
  }
};

export const getAvailableCrews = async (date) => {
  try {
    const response = await axiosInstance.get("/available_crew", {
      params: { date }, // Pass the date as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available crews:", error);
    throw error;
  }
};

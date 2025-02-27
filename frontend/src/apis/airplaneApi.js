import { getTokenFromCookie } from "../helper/auth";
import { axiosInstance } from "./axiosInstance";

export const getAirplanes = async () => {
  try {
    const accessToken = getTokenFromCookie("accessToken");
    const response = await axiosInstance.get("/get_airplanes");
    return response.data;
  } catch (error) {
    console.error("Error fetching airplanes:", error);
    throw error;
  }
};

export const addAirplanes = async (formData) => {
  try {
    const response = await axiosInstance.post("/add_airplane", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding airplane:", error);
    throw error.response?.data?.message || "Failed to add airplane";
  }
};

export const editAirplanes = async (formData, airplane_id) => {
  try {
    const response = await axiosInstance.put(
      `/edit_airplane/${airplane_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing airplane:", error);
    throw error.response?.data?.message || "Failed to edit airplane";
  }
};

export const deleteAirplane = async (airplane_id) => {
  try {
    const response = await axiosInstance.delete(
      `/delete_airplane/${airplane_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting airplane:", error);
    throw error.response?.data?.message || "Failed to delete airplane";
  }
};

export const getAvailablePlanes = async (date) => {
  try {
    const response = await axiosInstance.get("/available_airplanes", {
      params: { date }, // Pass the date as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available airplanes:", error);
    throw error;
  }
};

export const getAirplaneImage = async () => {
  try {
    const response = await axiosInstance.get("/get_airplane_image");
    return response.data;
  } catch (error) {
    console.error("Error fetching airplane image:", error);
    throw error;
  }
};

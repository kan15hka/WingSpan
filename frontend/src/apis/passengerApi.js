import { axiosInstance } from "./axiosInstance";

export const passengerSignUp = async (userData) => {
  try {
    const response = await axiosInstance.post("/pass_sign_up", userData);
    return response.data;
  } catch (error) {
    console.error("Error Signing Up Passenger:", error);
    throw error;
  }
};
export const passengerSignIn = async (userData) => {
  try {
    const response = await axiosInstance.post("/pass_sign_in", userData);
    return response.data;
  } catch (error) {
    console.error("Error Signing in Passenger:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/get_all_user");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

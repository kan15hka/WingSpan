import { axiosInstance } from "./axiosInstance";

export const authoritySignIn = async (authUser) => {
  try {
    const response = await axiosInstance.post("/auth_sign_in", authUser);
    return response.data;
  } catch (error) {
    console.error("Error Signing in Authority:", error);
    throw error;
  }
};

export const addAuthority = async (authorityData) => {
  try {
    const response = await axiosInstance.post("/add_authority", authorityData);
    return response.data;
  } catch (error) {
    console.error("Error adding Authority:", error);
    throw error;
  }
};
export const deleteAuthority = async (authorityId) => {
  try {
    const response = await axiosInstance.delete(
      `/delete_authority/${authorityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Authority:", error);
    throw error;
  }
};
export const getAuthorities = async () => {
  try {
    const response = await axiosInstance.get("/get_authorities");
    return response.data;
  } catch (error) {
    console.error("Error fetching authorities:", error);
    throw error;
  }
};

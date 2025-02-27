import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileSideBar from "../components/ProfileSideBar";
import { useToast } from "../components/Toast/ToastService";
import { axiosInstance } from "../apis/axiosInstance";
import PageMsgDisplay from "../components/PageMsgDisplay";
import AdminTable from "./AdminTable";

export default function AdminPage() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const user = location.state || storedUser;
  const toast = useToast();
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState(null);

  const getAllEmployees = async () => {
    try {
      const response = await axiosInstance.get(`employees/`);
      console.log(response.data.employees);
      setEmployees(response.data.employees);
      //   toast.open("User SignIn successfull!", toastType.SUCCESS);
    } catch (error) {
      console.log("Error:", error);
      setError("Error Fetching Data.");
    }
  };
  useEffect(() => {
    getAllEmployees();
  }, []);

  if (error) return <PageMsgDisplay text={error} />;
  return (
    <div className="h-screen flex">
      <ProfileSideBar user={user} />
      <div className="flex-1 border p-6 m-2 rounded-md">
        <div className="text-xl font-semibold ">Welcome, {user.name}!</div>
        <div className="w-full flex items-center">
          {employees && <AdminTable data={employees} />}
        </div>
      </div>
    </div>
  );
}

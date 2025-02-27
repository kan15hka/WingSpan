import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileSideBar from "../components/ProfileSideBar";
import { axiosInstance } from "../apis/axiosInstance";
import EmployeeTable from "./EmployeeTable";
import PageMsgDisplay from "../components/PageMsgDisplay";
import { toastType } from "../helper/helper";
import { useToast } from "../components/Toast/ToastService";

export default function EmployeePage() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const user = location.state || storedUser;

  const toast = useToast();
  const [error, setError] = useState(null);
  const [checkInOutData, setCheckInOutData] = useState(null);

  const onCheckIn = async () => {
    try {
      const response = await axiosInstance.get(`checkin/${user.username}`);
      console.log(response);
      toast.open("Checkin successfull!", toastType.SUCCESS);
    } catch (error) {
      console.log("Error:", error);
      toast.open(
        error?.response?.data.message || "Checkin Failed!",
        toastType.ERROR
      );
    } finally {
      getUserData();
    }
  };

  const onCheckOut = async () => {
    try {
      const response = await axiosInstance.get(`checkout/${user.username}`);
      console.log(response);
      toast.open("CheckOut successfull!", toastType.SUCCESS);
    } catch (error) {
      console.log("Error:", error);
      toast.open(
        error?.response?.data.message || "CheckOut Failed!",
        toastType.ERROR
      );
    } finally {
      getUserData();
    }
  };

  const getUserData = async () => {
    try {
      const response = await axiosInstance.get(`employee/${user.username}`);
      console.log(response.data.check_in_outs);
      setCheckInOutData(response.data.check_in_outs);
      //   toast.open("User SignIn successfull!", toastType.SUCCESS);
    } catch (error) {
      console.log("Error:", error);
      setError("Error Fetching Data.");
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  if (error) return <PageMsgDisplay text={error} />;

  return (
    <div className="h-screen flex">
      <ProfileSideBar user={user} />
      <div className="flex-1 border p-6 m-2 rounded-md">
        <div className="text-xl font-semibold ">Welcome, {user.name}!</div>
        <div className="w-full flex items-center">
          {checkInOutData && (
            <EmployeeTable
              data={checkInOutData}
              onCheckIn={onCheckIn}
              onCheckOut={onCheckOut}
            />
          )}
        </div>
      </div>
    </div>
  );
}

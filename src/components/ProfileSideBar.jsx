import React from "react";
import { axiosInstance } from "../apis/axiosInstance";
import { useToast } from "./Toast/ToastService";
import { toastType } from "../helper/helper";
import { useNavigate } from "react-router-dom";

export default function ProfileSideBar({ user }) {
  const toast = useToast();
  const navigate = useNavigate();
  const onSignOutClicked = async () => {
    try {
      const response = await axiosInstance.post("signout/");
      console.log("Response:", response);
      toast.open("User SignOut successfull!", toastType.SUCCESS);
      navigate("/signin");
      localStorage.clear();
    } catch (error) {
      console.log("Error:", error);
      toast.open(
        error?.response?.data.message || "Error signing out user!",
        toastType.ERROR
      );
    }
  };
  return (
    <div className="w-56 my-2 ml-2 rounded-md bg-primary-light flex flex-col  p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-3">
          <div className="w-full flex justify-center">
            <div className=" bg-white text-2xl font-semibold h-16 w-16 flex items-center justify-center rounded-lg text-primary-light">
              {user?.name?.substring(0, 2).toUpperCase() || "NA"}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ProfileCard title="Name" content={user.name} />
            <ProfileCard title="Username" content={user.username} />
            <ProfileCard title="Role" content={user.role} />
            <ProfileCard title="Phone Number" content={user.phone_number} />
            <ProfileCard title="Job Tilte" content={user.job_title} />
            <ProfileCard title="Gender" content={user.gender} />
          </div>
        </div>
      </div>
      <div
        onClick={onSignOutClicked}
        className="mt-6 w-full hover:bg-white/75 bg-white font-semibold text-primary-light cursor-pointer rounded-md py-2 text-center"
      >
        SignOut
      </div>
    </div>
  );
}

const ProfileCard = ({ title, content }) => {
  return (
    <div>
      <div className="uppercase text-sm text-white/50">{title}</div>{" "}
      <div className="text-base text-white">{content}</div>
    </div>
  );
};

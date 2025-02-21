import React, { useState } from "react";
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { useAuth } from "../../../context/AuthContext";
import { FaRegUser } from "react-icons/fa6";
import { useToast } from "../../../components/Toast/ToastService";
import { toastType } from "../../../helper/helper";
import { axiosInstance } from "../../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
export default function UserAuthCard({ onProfileClicked }) {
  const [showLoginDropDown, setShowLoginDropDown] = useState(false);
  const [showUserLogout, setShowUserLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, removeUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const onAuthorityLoginClicked = () => {
    navigate("/authority-login");
  };
  const onPassengerLoginClicked = () => {
    navigate("/passenger-signin");
  };
  const onLogoutClicked = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await axiosInstance.post(
        user?.role === "user" ? "/pass_sign_out" : "/auth_sign_out"
      );
      removeUser();
      toast.open("Logged out successfully", toastType.SUCCESS);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if server request fails
      removeUser();
      toast.open(
        error?.response?.data?.message || "Logged out with errors",
        toastType.ERROR
      );
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      {user ? (
        <div
          onClick={() => {
            setShowUserLogout(!showUserLogout);
          }}
          className="flex gap-2 cursor-pointer items-center border p-2 rounded-md bg-white"
        >
          <div className="h-10 w-10 flex items-center justify-center bg-primary-light text-white font-semibold rounded-md">
            {user?.username?.substring(0, 2).toUpperCase() || "NA"}
          </div>
          <div className="flex flex-col">
            <div className="font-semibold ">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.username}</div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setShowLoginDropDown(!showLoginDropDown);
          }}
          className="ml-24 font-semibold bg-primary-light rounded-md hover:bg-primary text-white py-2 px-3 text-sm cursor-pointer"
        >
          Login
        </div>
      )}
      {user && showUserLogout && (
        <div className="absolute w-32  cursor-pointer top-16 right-0 bg-white text-gray-600 hover:text-gray-700 border rounded-md flex flex-col">
          <div className="capitalize text-black font-medium p-2 border-b">
            {user.role === "user" ? "passenger" : user.role}
          </div>
          {user.role === "user" && (
            <div
              onClick={() => {
                setShowUserLogout(false);
                onProfileClicked();
              }}
              className="flex p-2 border-b gap-2 items-center  hover:bg-gray-200 "
            >
              <div>
                <FaRegUser size={18} />
              </div>
              <div className="text-sm">Profile</div>
            </div>
          )}
          <div
            onClick={onLogoutClicked}
            className="flex p-2 gap-2 items-center  hover:bg-gray-200 rounded-b-md"
          >
            <div>
              <TbLogout2 size={18} />
            </div>
            <div className="text-sm">
              {isLoggingOut ? "Logging Out" : "Logout"}
            </div>
          </div>
        </div>
      )}
      {showLoginDropDown && (
        <div className="absolute cursor-pointer top-12 right-0 bg-white text-gray-600 hover:text-gray-700 border rounded-md flex flex-col">
          <div
            onClick={onAuthorityLoginClicked}
            className="flex gap-2 items-center p-2 border-b hover:bg-gray-200 rounded-t-md"
          >
            <div>
              <RiAdminLine size={18} />
            </div>
            <div className="text-sm">Authority Login</div>
          </div>
          <div
            onClick={onPassengerLoginClicked}
            className="flex gap-2 items-center p-2 border-b hover:bg-gray-200 rounded-b-md"
          >
            <div>
              <AiOutlineUser size={18} />
            </div>
            <div className="text-sm">Passenger Login</div>
          </div>{" "}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast/ToastService";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../apis/axiosInstance";
import { toastType } from "../helper/helper";
import SideBar from "../components/SideBar/SideBar";
import Dashboard from "./Dashboard/Dashboard";
import { FiLogOut } from "react-icons/fi";
import AuthorityUserCard from "../components/AuthorityUserCard";
import Modal from "../components/Modal";
import AuthorityProfileModal from "./Authority/AuthorityProfileModal";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedPage, setSelectedPage] = useState(<Dashboard />);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { user, removeUser } = useAuth();

  const [openModal, setOpenModal] = useState(false);

  const onAuthoritySignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await axiosInstance.post("/auth_sign_out");
      removeUser();
      toast.open("Logged out successfully", toastType.SUCCESS);
      navigate("/authority-login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if server request fails
      removeUser();
      toast.open(
        error?.response?.data?.message || "Logged out with errors",
        toastType.ERROR
      );
      navigate("/authority-login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative flex gap-2 p-2 h-screen">
      <SideBar
        open={open}
        setOpen={setOpen}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        setSelectedPage={setSelectedPage}
      />

      <div className="flex-grow h-full w-full p-5 bg-cutomGrey-light border rounded-md overflow-x-scroll overscroll-y-none">
        {selectedPage}
      </div>

      <AuthorityUserCard
        user={user}
        open={open}
        setOpen={setOpen}
        onAuthoritySignOut={onAuthoritySignOut}
        isLoggingOut={isLoggingOut}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setShowProfileModal={setShowProfileModal}
      />
      <AuthorityProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
    </div>
  );
}

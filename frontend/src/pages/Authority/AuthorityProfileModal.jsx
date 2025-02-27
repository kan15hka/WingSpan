import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { axiosInstance } from "../../apis/axiosInstance";

export default function AuthorityProfileModal({
  showProfileModal,
  setShowProfileModal,
}) {
  const { user } = useAuth();
  const [userData, setUserData] = useState({});

  const getAuthority = async () => {
    try {
      const response = await axiosInstance.get(`/get_authority/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Profile error:", error);
      setShowProfileModal(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getAuthority();
    }
  }, [user?.id]); // Dependency array updated

  return (
    <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)}>
      <div className="w-48">
        <div className="capitalize font-semibold">Authority Profile</div>

        <div className="flex flex-col items-center border p-2 rounded-md">
          <div className="h-16 w-16 inline-flex items-center justify-center bg-primary-light text-white font-semibold rounded-full">
            {userData?.username?.substring(0, 2).toUpperCase() || "NA"}
          </div>
          <div className="font-medium">{userData?.name || "N/A"}</div>
          <div className="text-sm text-gray-600">
            {userData?.username || "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {userData?.reg_no || "N/A"}
          </div>
          <div className="text-sm text-gray-700 capitalize">
            {userData?.role || "N/A"}
          </div>
        </div>
      </div>
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthContext";
import { axiosInstance } from "../../../apis/axiosInstance";
import { useToast } from "../../../components/Toast/ToastService";
import { toastType } from "../../../helper/helper";
import BookingTicketCard from "../../../components/BookingTicketCard";

export default function ProfileModal({
  showProfileModal,
  setShowProfileModal,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const [userData, setUserData] = useState({});
  const [userBookings, setUserBookings] = useState([]);
  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/get_user/${user.id}`);
      setUserData(response.data);
      console.log(userData);
    } catch (error) {
      console.error("Profile error:", error);

      setShowProfileModal(false);
    }
  };
  const getUserBookings = async () => {
    try {
      const response = await axiosInstance.get(`/user_bookings/${user.id}`);
      const bookingsList = response.data["bookings"];
      setUserBookings(bookingsList);
      console.log(bookingsList);
    } catch (error) {
      console.error("Profile error:", error);

      setShowProfileModal(false);
      toast.open(
        error?.response?.data?.message || "Bookings fetch failed",
        toastType.ERROR
      );
    }
  };
  useEffect(() => {
    if (user?.id) {
      getUser();
      getUserBookings();
    }
  }, [user?.id]);

  return (
    <Modal
      open={showProfileModal}
      onClose={() => {
        setShowProfileModal(false);
      }}
    >
      <div className="w-80">
        <div className=" capitalize font-semibold">User Profile</div>
        <div className="my-2 flex justify-center">
          <div className=" inline-flex flex-col items-center border p-2 rounded-md">
            <div className="h-16 w-16 inline-flex items-center justify-center bg-primary-light text-white font-semibold rounded-full">
              {userData?.username?.substring(0, 2).toUpperCase() || "NA"}
            </div>
            <div className="font-medium">{userData.name}</div>
            <div className="text-sm text-gray-600">{userData.username}</div>
            <div className="text-xs text-gray-500">
              Gender: {userData.gender}
            </div>
            <div className="text-xs text-gray-500">DOB: {userData.dob}</div>
            <div className="text-xs text-gray-500">
              Nationality: {userData.nationality}
            </div>
          </div>
        </div>
        <div className="text-sm font-medium mb-2">Flights Booked</div>
        <div className="bg-cutomGrey-light rounded-md p-4 h-56 overflow-y-scroll">
          {" "}
          {Array.isArray(userBookings) &&
            (userBookings.length > 0 ? (
              userBookings.map((booking, index) => (
                <div key={index}>
                  <BookingTicketCard booking={booking} />
                </div>
              ))
            ) : (
              <div className="text-center text-sm mt-5 text-gray-400">
                No bookings found.Book some flights to display
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}

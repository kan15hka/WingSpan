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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/get_user/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Profile error:", error);
      setError("Cannot fetch User details");
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/user_bookings/${user.id}`);
      const bookingsList = response.data?.bookings || []; // Ensure bookings is an array
      setUserBookings(bookingsList);
    } catch (error) {
      console.error("Profile error:", error);
      setError("Cannot fetch User Booking details");
      toast.open(
        error?.response?.data?.message || "Bookings fetch failed",
        toastType.ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && showProfileModal) {
      getUser();
      getUserBookings();
    }
  }, [user?.id, showProfileModal]); // Added `showProfileModal` to dependency array

  return (
    <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)}>
      <div className="w-80 h-[500px]">
        {" "}
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary-light"></div>
          </div>
        ) : error ? (
          <div className="mt-10 text-red-600 text-center w-full mx-auto text-sm">
            {error}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="capitalize font-semibold">User Profile</div>
            <div className="my-2 flex justify-center">
              <div className="inline-flex flex-col items-center border p-2 rounded-md">
                <div className="h-16 w-16 inline-flex items-center justify-center bg-primary-light text-white font-semibold rounded-full">
                  {userData?.username?.substring(0, 2).toUpperCase() || "NA"}
                </div>
                <div className="font-medium">{userData?.name || "N/A"}</div>
                <div className="text-sm text-gray-600">
                  {userData?.username || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  Gender: {userData?.gender || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  DOB: {userData?.dob || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  Nationality: {userData?.nationality || "N/A"}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium mb-2">Flights Booked</div>
            <div className="flex-1 w-full bg-cutomGrey-light rounded-md p-4  overflow-y-scroll">
              {Array.isArray(userBookings) && userBookings.length > 0 ? (
                userBookings.map((booking, index) => (
                  <BookingTicketCard key={index} booking={booking} />
                ))
              ) : (
                <div className="text-center text-sm mt-5 text-gray-400">
                  No bookings found. Book some flights to display
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

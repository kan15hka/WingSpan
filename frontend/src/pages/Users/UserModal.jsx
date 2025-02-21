import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { modalType, toastType } from "../../helper/helper";
import Modal from "../../components/Modal";
import BookingTicketCard from "../../components/BookingTicketCard";
import { useToast } from "../../components/Toast/ToastService";
import { axiosInstance } from "../../apis/axiosInstance";

export default function UserModal({
  open,
  setOpen,
  userBookings,
  user,
  getUserBookings,
}) {
  const toast = useToast();

  const onDeleteBooking = async (bookingId) => {
    try {
      const response = await axiosInstance.delete(
        `/delete_booking/${bookingId}`
      );

      toast.open(
        response.data.message || "Booking deleted successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error deleting Booking.",
        toastType.ERROR
      );
    } finally {
      getUserBookings(user.id);
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className=" font-medium">{user.name} Flight Bookings</div>
      <div className="mb-3 text-sm text-gray-500">
        User flight bookings appear here
      </div>
      <div className="bg-cutomGrey-light rounded-md p-4 h-56 overflow-y-scroll">
        {Array.isArray(userBookings) &&
          userBookings.map((booking, index) => (
            <div key={index}>
              <BookingTicketCard
                booking={booking}
                onDeleteBooking={onDeleteBooking}
              />
            </div>
          ))}
      </div>
    </Modal>
  );
}

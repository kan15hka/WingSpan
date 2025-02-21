import React, { useEffect } from "react";
import { IoIosAirplane } from "react-icons/io";
import {
  MdDelete,
  MdEdit,
  MdOutlineFlight,
  MdOutlineFlightTakeoff,
} from "react-icons/md";
import { TbTicket } from "react-icons/tb";
import {
  calculateTimeGap,
  convertToHHMM,
  formatDate,
} from "../../../helper/formatter";
import { RiPlaneFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import Modal from "../../../components/Modal";
import { formatDateToddMonthYYYY, toastType } from "../../../helper/helper";
import { useAuth } from "../../../context/AuthContext";
import { bookFlight } from "../../../apis/bookingApi";
import { useToast } from "../../../components/Toast/ToastService";

export default function BookFlightModal({
  showBookingModal,
  setShowBookingModal,
  flight,
  date,
  seatCount,
  fetchPassengerFlights,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const onBookFlight = async () => {
    if (user.role !== "user") {
      toast.open("Authority cannot book flights.", toastType.ERROR);
    }
    const userId = user.id;
    const bookingData = {
      user_id: userId,
      flight_id: flight.id,
      seats_to_book: seatCount,
    };
    console.log(bookingData);
    try {
      const responseData = await bookFlight(bookingData);
      toast.open(
        responseData.message || "Fligt booked successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error booking flight.",
        toastType.ERROR
      );
    } finally {
      setShowBookingModal(false);
      fetchPassengerFlights();
    }
  };
  return (
    <Modal
      open={showBookingModal}
      onClose={() => {
        setShowBookingModal(false);
      }}
    >
      {flight && (
        <div className="w-72">
          <div className="font-semibold">Book Flight</div>
          <div className="text-sm text-gray-500">
            Review the details before booking.
          </div>
          <div>
            {" "}
            <div className="pt-3 px-3 flex items-center justify-between">
              <div className="mx-1 flex items-center gap-3 text-sm">
                <div className="bg-primary-light/10 p-2 rounded-full">
                  <MdOutlineFlightTakeoff
                    size={15}
                    className="text-primary-light"
                  />
                </div>
                <div>{flight?.airplane?.airline}</div>
              </div>
            </div>
            <div className=" px-3 flex mx-1 gap-6 mt-3">
              <div>
                <div className="font-semibold">{flight?.from_code}</div>
                <div className="text-xs text-gray-500">{flight?.from_city}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {convertToHHMM(flight.from_time || "00:00:00")}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="text-xs text-black">
                  {calculateTimeGap(
                    flight.from_time || "00:00:00",
                    flight.to_time || "00:00:00"
                  )}
                </div>

                <div className="flex flex-row items-center w-full">
                  <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                  <div className="flex-1 h-[1px] bg-gray-400"></div>
                  <div className="text-primary-light">
                    <IoIosAirplane size={18} />
                  </div>
                  <div className="flex-1 h-[1px] bg-gray-400"></div>
                  <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                </div>

                <div className="text-xs text-gray-500">Non-Stop</div>
              </div>

              <div className="flex flex-col items-end">
                <div className="font-semibold">{flight?.to_code}</div>
                <div className="text-xs text-gray-500">{flight?.to_city}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {convertToHHMM(flight.to_time || "00:00:00")}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4  mt-3 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {formatDateToddMonthYYYY(date)}
            </div>
            <div className="text-xs text-gray-500">{seatCount} seats</div>
          </div>
          <div className="px-4  mt-3 flex gap-1 items-center">
            <div className="text-sm font-semibold text-gray-500">Price:</div>
            <div className="text-sm font-semibold text-gray-700">
              ${flight.price}
            </div>
          </div>
          <div
            onClick={onBookFlight}
            className="w-full rounded-md mt-3 text-center bg-primary-light hover:bg-primary text-white font-medium cursor-pointer py-2"
          >
            Book Now
          </div>
        </div>
      )}
    </Modal>
  );
}

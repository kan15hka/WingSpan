import React, { useEffect } from "react";
import { IoIosAirplane } from "react-icons/io";
import {
  MdDelete,
  MdEdit,
  MdOutlineFlight,
  MdOutlineFlightTakeoff,
} from "react-icons/md";
import { TbTicket } from "react-icons/tb";
import { calculateTimeGap, convertToHHMM } from "../helper/formatter";
import { RiPlaneFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../apis/axiosInstance";

export default function BookingTicketCard({ booking, onDeleteBooking }) {
  const { user } = useAuth();

  return (
    <div className="bg-white w-full py-3 px-3 rounded-xl mb-3">
      <div className="flex items-center justify-between">
        <div className="mx-1 flex items-center gap-3 text-sm">
          <div className="bg-primary-light/10 p-2 rounded-full">
            <MdOutlineFlightTakeoff size={15} className="text-primary-light" />
          </div>
          <div>{booking?.airplane?.airline}</div>
        </div>
        {user.role === "admin" && (
          <div
            onClick={() => {
              console.log(booking.booking_id);
              onDeleteBooking(booking.booking_id);
            }}
            className="p-2 rounded-full bg-cutomGrey-light hover:bg-gray-300"
          >
            <MdDelete className="text-primary-light" />
          </div>
        )}
      </div>
      <div className="flex mx-1 gap-6 mt-3">
        <div>
          <div className="font-semibold">{booking?.from_code}</div>
          <div className="text-xs text-gray-500">{booking?.from_city}</div>
          <div className="text-sm font-semibold text-gray-800">
            {convertToHHMM(booking?.from_time)}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-black">
            {calculateTimeGap(booking?.from_time, booking?.to_time)}
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
          <div className="font-semibold">{booking?.to_code}</div>
          <div className="text-xs text-gray-500">{booking?.to_city}</div>
          <div className="text-sm font-semibold text-gray-800">
            {convertToHHMM(booking?.to_time)}
          </div>
        </div>
      </div>

      <div className="mt-4 relative h-4">
        <div className="absolute rounded-full -left-6 -top-3 h-6 w-6 bg-cutomGrey-light"></div>
        <div className="w-full border-t-2 border-dashed border-gray-300 my-3"></div>
        <div className="absolute rounded-full -right-6 -top-3 h-6 w-6 bg-cutomGrey-light"></div>
      </div>

      <div className="mx-1 mt-1 flex justify-between items-center">
        <div className="flex gap-3">
          <div className="text-gray-400 flex items-center gap-1">
            <TbTicket />
            <div className="text-xs">
              {booking?.airplane.seatcount} tickets booked
            </div>
          </div>
        </div>
        <div className="font-bold text-primary-light">${booking?.price}</div>
      </div>
    </div>
  );
}

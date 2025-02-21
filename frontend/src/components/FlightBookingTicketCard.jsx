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

export default function FlightBookingTicketCard({
  flight,
  isSelectedtoBook,
  onBookingClicked,
}) {
  return (
    <div
      className={` w-full  rounded-xl mb-3  transition-colors duration-500 bg-white`}
    >
      <div className="pt-3 px-3 flex items-center justify-between">
        <div className="mx-1 flex items-center gap-3 text-sm">
          <div className="bg-primary-light/10 p-2 rounded-full">
            <MdOutlineFlightTakeoff size={15} className="text-primary-light" />
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

      <div className=" mx-3 mt-4  relative ">
        <div className="absolute rounded-full -left-6 -top-3 h-6 w-6 bg-cutomGrey-light"></div>
        <div className="w-full border-t-2 border-dashed border-gray-300 "></div>
        <div className="absolute rounded-full -right-6 -top-3 h-6 w-6 bg-cutomGrey-light"></div>
      </div>

      <div
        className={`px-4 pt-4 pb-3 rounded-b-lg flex justify-between items-center transition-colors duration-500 ${
          isSelectedtoBook ? "bg-primary-light " : "bg-white"
        }`}
      >
        <div className="flex gap-3">
          <div
            className={`flex items-center gap-1 ${
              isSelectedtoBook ? "text-white " : "text-gray-400"
            }`}
          >
            <TbTicket />
            <div
              className={`text-xs ${
                isSelectedtoBook ? "text-white " : "text-gray-400"
              }`}
            >
              {parseInt(flight?.total_seats) - parseInt(flight?.booked_seats)}{" "}
              Remaining
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div
            className={`font-bold ${
              isSelectedtoBook ? "text-white " : "text-primary-light"
            }`}
          >
            ${flight?.price}
          </div>
          {isSelectedtoBook && (
            <div
              onClick={onBookingClicked}
              className="cursor-pointer bg-white py-1 px-2 text-sm rounded-md text-primary-light font-medium"
            >
              Book Now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

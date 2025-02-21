import React, { useEffect } from "react";
import { IoIosAirplane } from "react-icons/io";
import {
  MdDelete,
  MdEdit,
  MdOutlineAirplaneTicket,
  MdOutlineFlight,
  MdOutlineFlightTakeoff,
} from "react-icons/md";
import { TbTicket } from "react-icons/tb";
import { calculateTimeGap, convertToHHMM } from "../helper/formatter";
import { RiPlaneFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";

export default function FlightCard({
  flight,

  isAuthority,
  onEditClicked,
  onDeleteClicked,
  onAirplaneClicked,
  onCrewClicked,
  onBookingClicked,
}) {
  return (
    <div className="bg-white w-full py-3 px-3 rounded-xl mb-3">
      <div className="flex items-center justify-between">
        <div className="mx-1 flex items-center gap-3 text-sm">
          <div className="bg-primary-light/10 p-2 rounded-full">
            <MdOutlineFlightTakeoff size={15} className="text-primary-light" />
          </div>
          <div>{flight?.airplane?.airline}</div>
        </div>
        {isAuthority && (
          <div className="flex gap-2 items-center justify-center">
            <div
              onClick={onEditClicked}
              className="bg-primary-light/10 text-primary-light p-2 rounded-full hover:bg-primary-light hover:text-white duration-300"
            >
              <MdEdit size={13} />
            </div>
            <div
              onClick={onDeleteClicked}
              className="bg-primary-light/10 text-primary-light p-2 rounded-full hover:bg-primary-light hover:text-white duration-300"
            >
              <MdDelete size={13} />
            </div>
          </div>
        )}
      </div>
      <div className="flex mx-1 gap-6 mt-3">
        <div>
          <div className="font-semibold">{flight?.from_code}</div>
          <div className="text-xs text-gray-500">{flight?.from_city}</div>
          <div className="text-sm font-semibold text-gray-800">
            {convertToHHMM(flight?.from_time)}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-black">
            {calculateTimeGap(flight?.from_time, flight?.to_time)}
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
            {convertToHHMM(flight?.to_time)}
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
              {flight?.total_seats - flight?.booked_seats} Remaining
            </div>
          </div>
          {isAuthority && (
            <div className="flex gap-2 items-center justify-center">
              <div
                onClick={onAirplaneClicked}
                className="bg-primary-light/10 text-primary-light p-2 rounded-full hover:bg-primary-light hover:text-white duration-300"
              >
                <RiPlaneFill size={13} />
              </div>
              <div
                onClick={onCrewClicked}
                className="bg-primary-light/10 text-primary-light p-2 rounded-full hover:bg-primary-light hover:text-white duration-300"
              >
                <FaPeopleGroup size={13} />
              </div>
              <div
                onClick={onBookingClicked}
                className="bg-primary-light/10 text-primary-light p-2 rounded-full hover:bg-primary-light hover:text-white duration-300"
              >
                <MdOutlineAirplaneTicket size={13} />
              </div>
            </div>
          )}
        </div>
        <div className="font-bold text-primary-light">${flight?.price}</div>
      </div>
    </div>
  );
}

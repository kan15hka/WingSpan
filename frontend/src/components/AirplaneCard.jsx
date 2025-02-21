import React from "react";
import { ImAirplane } from "react-icons/im";
import { FaUser } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { modalType } from "../helper/helper";
export default function AirplaneCard({
  airplane,
  onDeleteAirplane,
  setModalData,
  isEditable = true,
}) {
  return (
    <div className="flex flex-col bg-white border p-3 rounded-md">
      <div className="relative">
        <div className="bg-gray-100 rounded-md h-32 w-full">
          <img
            src={`data:image/png;base64,${airplane?.image_data}`}
            alt="Airplane"
            className="h-full w-full object-contain"
          />
        </div>
        {isEditable && (
          <div className="absolute top-2 left-2 flex gap-2">
            <div
              onClick={() => {
                setModalData({
                  open: true,
                  type: modalType.EDIT,
                  data: airplane,
                });
              }}
              className=" p-2 rounded-full duration-300 bg-white text-primary-light hover:bg-primary-light hover:text-white "
            >
              <MdEdit size={18} className=" " />
            </div>
            <div
              onClick={() => {
                onDeleteAirplane(airplane);
              }}
              className=" p-2 rounded-full duration-300 bg-white text-primary-light hover:bg-primary-light hover:text-white "
            >
              <MdDelete size={18} className=" " />
            </div>
          </div>
        )}
      </div>
      <div className="flex mr-auto mt-2 mb-1 px-2 py-1 text-xs rounded-sm text-white bg-primary-light ">
        {airplane?.manufacturer}
      </div>
      <div className="font-semibold">{airplane?.model}</div>
      <div className="flex items-center gap-1 text-gray-500">
        <ImAirplane className="text-gray-400" size={12} />{" "}
        <div className="text-xs">{airplane?.airline}</div>
      </div>

      <div className="mt-2 border-t pt-2 flex justify-evenly flex-col gap-1 sm:flex-row  ">
        <div className="flex items-center gap-2 ">
          <FaUser size={18} className="text-primary-light" />
          <div className="flex flex-col">
            <div className="text-xs text-gray-600">PASSENGERS</div>
            <div className="flex items-center gap-1">
              <div className="text-sm font-semibold">
                {airplane?.passenger_capacity}
              </div>
              <div className="text-xs text-gray-600">seats</div>
            </div>
          </div>
        </div>{" "}
        <div className="flex items-center gap-2 ">
          <FaUser size={18} className="text-primary-light" />
          <div className="flex flex-col">
            <div className="text-xs text-gray-600">CREW</div>
            <div className="flex items-center gap-1">
              <div className="text-sm font-semibold">
                {airplane?.crew_capacity}
              </div>
              <div className="text-xs text-gray-600">people</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

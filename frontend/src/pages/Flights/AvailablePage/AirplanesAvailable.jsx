import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import AirplaneCard from "../../../components/AirplaneCard";

export default function AirplanesAvailable({ planes, onBackClicked }) {
  return (
    <div className="flex-1">
      <div className=" flex gap-2 ">
        <div
          onClick={onBackClicked}
          className="bg-white border rounded-full p-1"
        >
          <FaAngleLeft />
        </div>
        <div className="font-semibold">Available Airplanes</div>
      </div>
      {planes.length > 0 ? (
        <div className="w-full mt-2 grid grid-cols-2 gap-2 ">
          {planes.map((plane) => (
            <div
              key={plane.id}
              className={`flex  rounded-md border p-2 gap-2 ${"bg-white"}`}
            >
              <div className="h-20 w-36">
                <img
                  src={`data:image/png;base64,${plane.image_data}`}
                  alt="Airplane1"
                  className={`h-20 bg-cutomGrey-light w-36 object-contain rounded-md `}
                />
              </div>
              <div className="w-full ">
                <div className="flex items-center justify-between">
                  <div className="inline-flex text-[10px] bg-primary-light/80 py-1 px-2 text-white rounded">
                    {plane.manufacturer}
                  </div>
                </div>
                <div className="text-sm font-semibold">{plane.model}</div>
                <div className="text-xs text-gray-500">{plane.airline}</div>
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500">
                    {plane.passenger_capacity} seats
                  </div>
                  <div className="text-xs text-gray-500">
                    {plane.crew_capacity} crew
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 w-full  mx-auto max-w-80 text-center  text-sm text-gray-600 ">
          No available airplanes to schedule flight.
        </div>
      )}
    </div>
  );
}

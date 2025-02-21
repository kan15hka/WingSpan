import React from "react";

export default function AddPlane({
  planes,
  selectedPlaneId,
  setSelectedPlaneId,
}) {
  return (
    <div className="w-[550px] h-[400px] flex-1 bg-cutomGrey-light rounded-md p-2 mt-2 overflow-y-scroll">
      <div className=" font-semibold text-sm uppercase text-gray-800">
        Available Airplanes
      </div>
      <div className="text-sm text-gray-600 mb-3 mt-1">
        Select an airplane to proceed adding flight schedule
      </div>
      {planes.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {planes.map((plane) => (
            <div
              key={plane.id}
              className={`flex  rounded-md border p-2 gap-2 ${
                selectedPlaneId === plane.id
                  ? "bg-white border-primary-light border-2"
                  : "bg-white"
              }`}
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
                  <input
                    type="checkbox"
                    checked={selectedPlaneId === plane.id}
                    id={plane.id}
                    className="accent-primary-light h-4 w-4"
                    onChange={() => {
                      setSelectedPlaneId(plane.id);
                    }}
                  />
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

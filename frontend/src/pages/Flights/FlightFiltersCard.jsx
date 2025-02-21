import React, { useState } from "react";
import PriceSlider from "../../components/PriceSlider/PriceSlider";
import { useAuth } from "../../context/AuthContext";

export default function FlightFiltersCard({
  onAirplanesPressed,
  onCrewPressed,
  isAirplaneFilter,
  isCrewFilter,
}) {
  const [duration, setDuration] = useState(24);

  const departureTimeFilterList = [
    { timeRange: "00:00 - 06:00", text: "Early Morning" },
    { timeRange: "06:00 - 12:00", text: "Morning" },
    { timeRange: "12:00 - 18:00", text: "Mid Day" },
    { timeRange: "18:00 - 24:00", text: "Night" },
  ];
  const { user } = useAuth();
  return (
    <div className="max-h-fit w-64 p-3 border rounded-md bg-white ">
      <div className="border-b">
        <div className="text-sm font-semibold">Departure times</div>

        <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
          {departureTimeFilterList.map((filter, index) => (
            <div
              key={index}
              className=" rounded-md border p-2 hover:bg-cutomGrey-light"
            >
              <div className="text-xs font-semibold">{filter.timeRange}</div>
              <div className="text-xs text-gray-500">{filter.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Duration Slider */}
      <div className={` ${!user.role === "user" && "border-b"}`}>
        <div className="mt-2 ">
          <div className="text-sm font-semibold">Journey duration</div>
          <PriceSlider
            minVal={1.5}
            maxVal={24}
            price={duration}
            setPrice={setDuration}
          />
        </div>
      </div>
      {!user.role === "user" && (
        <div className="mt-2 ">
          <div className="text-sm font-semibold">Flight Availability</div>
          <div className="flex gap-2 mt-2">
            <div
              onClick={onAirplanesPressed}
              className={`flex-1 text-sm flex items-center justify-center rounded-md border p-2 hover:bg-cutomGrey-light ${
                isAirplaneFilter &&
                "bg-primary-light text-white hover:bg-primary-light hover:text-white "
              }`}
            >
              Airplanes
            </div>
            <div
              onClick={onCrewPressed}
              className={`flex-1 text-sm flex items-center justify-center rounded-md border p-2 hover:bg-cutomGrey-light ${
                isCrewFilter &&
                "bg-primary-light text-white hover:bg-primary-light hover:text-white "
              }`}
            >
              Crew
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

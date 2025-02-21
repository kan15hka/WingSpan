import React, { useState } from "react";
import { indianAirports } from "../../../helper/airports";
import { TbBuildingAirport } from "react-icons/tb";
import { LiaPlaneDepartureSolid } from "react-icons/lia";
import { flightType } from "../../../helper/helper";

const AirportDropDown = ({
  type,
  selectedCity,
  selectedCode,
  setSelectedCity,
  setSelectedCode,
  time,
  setTime,
}) => {
  const [query, setQuery] = useState(
    selectedCity && selectedCode ? `${selectedCity} (${selectedCode})` : ""
  );

  const [showDropdown, setShowDropdown] = useState(false);

  const filteredAirports = indianAirports.filter(
    (airport) =>
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (airport) => {
    setSelectedCity(airport.city);
    setSelectedCode(airport.code);
    setQuery(`${airport.city} (${airport.code})`);
    setShowDropdown(false);
  };

  return (
    <div className=" w-full flex gap-2 items-center">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">
          {type === flightType.FROM ? "FROM AIRPORT" : "TO AIRPORT"}{" "}
        </label>
        <div className="relative w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={
              type === flightType.FROM ? "Enter Source" : "Enter Destination"
            }
            className="input-box w-full"
          />
          {showDropdown && query && (
            <ul className="absolute w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-md max-h-48 overflow-y-auto z-10">
              {filteredAirports.length > 0 ? (
                filteredAirports.map((airport) => (
                  <li
                    key={airport.code}
                    onClick={() => handleSelect(airport)}
                    className=" cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex gap-2 p-2 border-b">
                      <div className="p-2 rounded-full bg-cutomGrey-light">
                        <LiaPlaneDepartureSolid size={22} />
                      </div>
                      <div>
                        <div className="text-sm">
                          {airport.city} ({airport.code})
                        </div>
                        <div className="text-xs text-gray-600">India</div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 text-sm">No matches found</li>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">
          {type === flightType.FROM ? "FROM TIME" : "TO TIME"}
        </label>
        <input
          type="time"
          className="input-box"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AirportDropDown;

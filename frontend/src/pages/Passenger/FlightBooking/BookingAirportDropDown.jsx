import React, { useEffect, useState } from "react";
import { indianAirports } from "../../../helper/airports";
import { TbBuildingAirport } from "react-icons/tb";
import { LiaPlaneDepartureSolid } from "react-icons/lia";
import { flightType } from "../../../helper/helper";
import { MdClose } from "react-icons/md";

const BookingAirportDropDown = ({
  type,
  selectedCity,
  selectedCode,
  setSelectedCity,
  setSelectedCode,
}) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [query, setQuery] = useState("");

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
  useEffect(() => {
    setShowCloseButton(query.trim() !== "");
  }, [query]);
  return (
    <div className="relative w-56 m-4 flex gap-2 items-center">
      <div className="w-full  flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">
          {type === flightType.FROM ? "From" : "To"}{" "}
        </label>
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              //   setShowCloseButton(query.trim() !== "");
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="City or Airport"
            className="w-full text-base  rounded-md  text-slate-950 outline-none "
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
      {showCloseButton && (
        <div
          onClick={() => {
            setQuery("");
          }}
          className="top-0 right-0 absolute cursor-pointer bg-gray-300 p-1 rounded-full hover:bg-gray-400"
        >
          <MdClose />
        </div>
      )}
    </div>
  );
};

export default BookingAirportDropDown;

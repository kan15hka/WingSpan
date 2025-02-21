import React, { useState } from "react";
import { indianAirports } from "../../../helper/airports";
import AirportDropDown from "./AirportDropDown";
import { flightType } from "../../../helper/helper";

export default function AddFlight({
  error,
  fromCity,
  setFromCity,
  fromCode,
  setFromCode,
  toCity,
  setToCity,
  toCode,
  setToCode,
  fromTime,
  setFromTime,
  toTime,
  setToTime,
  price,
  setPrice,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-gray-600 ">
        Enter flight details to proceed.
      </div>
      <AirportDropDown
        selectedCity={fromCity}
        selectedCode={fromCode}
        type={flightType.FROM}
        setSelectedCity={setFromCity}
        setSelectedCode={setFromCode}
        time={fromTime}
        setTime={setFromTime}
      />

      <AirportDropDown
        selectedCity={toCity}
        selectedCode={toCode}
        type={flightType.TO}
        setSelectedCity={setToCity}
        setSelectedCode={setToCode}
        time={toTime}
        setTime={setToTime}
      />

      {/* Price Input */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-xs font-semibold text-gray-600">PRICE</label>
        <input
          type="number"
          className="input-box"
          placeholder="Enter Price"
          value={price}
          min="0"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      {/* Error Message */}
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}

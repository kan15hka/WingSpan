import React, { useState } from "react";
import BookingAirportDropDown from "./BookingAirportDropDown";
import { flightType } from "../../../helper/helper";
import BookingDatePicker from "./BookingDatePicker";
import BookingHeadCount from "./BookingHeadCount";
import { div } from "framer-motion/client";
export default function FlightBookingInputBox({
  fromCity,
  setFromCity,
  fromCode,
  setFromCode,
  toCity,
  setToCity,
  toCode,
  setToCode,
  date,
  setDate,
  count,
  setCount,
  onSearchClicked,
}) {
  return (
    <div className="flex gap-2">
      <div className="flex  rounded-lg mx-auto w-fit border bg-white">
        <BookingAirportDropDown
          type={flightType.FROM}
          selectedCity={fromCity}
          selectedCode={fromCode}
          setSelectedCity={setFromCity}
          setSelectedCode={setFromCode}
        />
        <div className="border-l border-r">
          <BookingAirportDropDown
            type={flightType.TO}
            selectedCity={toCity}
            selectedCode={toCode}
            setSelectedCity={setToCity}
            setSelectedCode={setToCode}
          />
        </div>
        <BookingDatePicker date={date} setDate={setDate} />
        <div className="border-l">
          <BookingHeadCount count={count} setCount={setCount} />
        </div>
      </div>
      <div
        onClick={onSearchClicked}
        className="p-1 text-sm text-white font-semibold cursor-pointer hover:bg-primary-dark bg-primary-light rounded-md flex-1 flex items-center justify-center"
      >
        Search
      </div>
    </div>
  );
}

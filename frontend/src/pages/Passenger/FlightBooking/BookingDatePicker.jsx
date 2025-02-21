import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../helper/helper";

const BookingDatePicker = ({ date, setDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="relative  w-48 m-4 flex gap-2 items-center">
      <div
        onClick={() => setShowCalendar((prev) => !prev)}
        className="w-full flex flex-col gap-1 cursor-pointer"
      >
        <label className="text-sm font-semibold text-gray-600">Date</label>
        <div className={`w-full ${date ? " text-black" : " text-gray-400"} `}>
          {date ? formatDate(date) : "Journey date"}
        </div>
      </div>

      {date && (
        <div
          onClick={() => {
            setDate(null);
            setShowCalendar(false);
          }}
          className="absolute top-1 right-1 cursor-pointer bg-gray-300 p-1 rounded-full hover:bg-gray-400"
        >
          <MdClose />
        </div>
      )}

      {showCalendar && (
        <div className="absolute z-10 top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 bg-white shadow-lg p-2 rounded-md">
          <DatePicker
            selected={date}
            onChange={(selectedDate) => {
              setDate(selectedDate);
              setShowCalendar(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default BookingDatePicker;

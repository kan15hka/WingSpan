import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { formatDate, formatDateLikeddMonth } from "../../../helper/formatter";

const getWeekDays = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date,
      dayNumber: date.getDate(),
    });
  }
  return dates;
};

export default function HorizontalBookingCalendar({
  selectedDate,
  setSelectedDate,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date(today.setDate(today.getDate() - today.getDay()))
  );

  const weekDays = getWeekDays(currentWeekStart);

  const nextWeek = () => {
    //Update next week start
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);

    //update selected date
    const nextWeekSelectedDate = new Date(selectedDate);
    nextWeekSelectedDate.setDate(nextWeekSelectedDate.getDate() + 7);
    setSelectedDate(nextWeekSelectedDate);
  };

  const prevWeek = () => {
    //Update prev week start
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
    //update selected date
    const prevWeekSelectedDate = new Date(selectedDate);
    prevWeekSelectedDate.setDate(prevWeekSelectedDate.getDate() - 7);
    setSelectedDate(prevWeekSelectedDate);
  };

  const handleDateChange = (date) => {
    const calenderSelectedDate = new Date(date); // Keep this unchanged

    const calenderSelectedStartDate = new Date(date); // Create a separate instance
    calenderSelectedStartDate.setDate(
      calenderSelectedStartDate.getDate() - calenderSelectedStartDate.getDay()
    );

    setCurrentWeekStart(calenderSelectedStartDate);
    setSelectedDate(calenderSelectedDate); // Ensure selectedDate is only the picked date
    setShowCalendar(false);
  };
  return (
    <div className="h-16 p-1  w-full relative flex gap-3 items-center my-3 ">
      <button
        onClick={prevWeek}
        className="bg-white rounded-md h-full px-4   text-gray-400 hover:text-gray-600"
      >
        <FaAngleLeft size={25} />
      </button>
      <div className="flex-1  flex justify-center">
        <div className=" flex  rounded-lg ">
          {weekDays.map(({ day, date, dayNumber }, index) => {
            const isSelected = formatDate(selectedDate) === formatDate(date);
            const isFirst = index === 0;
            const isLast = index === 6;
            return (
              <div
                key={date}
                onClick={() => setSelectedDate(new Date(date))}
                className={`w-32 cursor-pointer flex flex-col items-center  duration-300 p-2 ${
                  isSelected
                    ? `bg-primary text-white  `
                    : `bg-white text-gray-800 hover:bg-primary-light/5`
                }  ${isFirst && "rounded-l-lg"}  ${isLast && "rounded-r-lg"}  ${
                  !isFirst && " border-l"
                }`}
              >
                <div className="text-lg font-medium ">
                  {formatDateLikeddMonth(date)}
                </div>
                <div
                  className={` text-xs ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  2025{" "}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={nextWeek}
        className="bg-white rounded-md h-full px-4   text-gray-400 hover:text-gray-600"
      >
        <FaAngleRight size={25} />
      </button>
      {/* Calender */}
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-14 h-14 flex items-center justify-center bg-primary-light hover:bg-primary text-white rounded-md"
      >
        <FaCalendarDays size={22} />
      </div>
      {showCalendar && (
        <div
          className={`absolute z-10 duration-300 ${
            showCalendar
              ? "opacity-100 top-14 right-0"
              : "opacity-0 top-0 left-0"
          }`}
        >
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
          />
        </div>
      )}
    </div>
  );
}

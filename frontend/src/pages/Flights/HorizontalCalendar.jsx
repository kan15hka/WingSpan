import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { formatDateToddMonthYYYY, formatDate } from "../../helper/helper";
import { IoMdAdd } from "react-icons/io";

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
  //   console.log(dates);
  return dates;
};

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  showCalendar,
  setShowCalendar,
  onAddPressed,
}) {
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

    console.log("Selected Date:", formatDate(calenderSelectedDate));
    console.log("Week Start Date:", formatDate(calenderSelectedStartDate));

    setCurrentWeekStart(calenderSelectedStartDate);
    setSelectedDate(calenderSelectedDate); // Ensure selectedDate is only the picked date
    setShowCalendar(false);
  };
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className=" mb-2 px-2 py-1 text-xs font-semibold bg-white rounded-md border">
          {formatDateToddMonthYYYY(selectedDate)}
        </div>
      </div>

      <div className="relative  flex items-center justify-between space-x-2 pb-2">
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
                ? "opacity-100 top-14 left-14"
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
        <button
          onClick={prevWeek}
          className="px-3 py-2 text-gray-400 hover:text-gray-600"
        >
          <FaAngleLeft size={25} />
        </button>
        <div className="flex space-x-2 overflow-x-auto">
          {weekDays.map(({ day, date, dayNumber }) => (
            <div
              key={date}
              onClick={() => setSelectedDate(new Date(date))}
              className={`cursor-pointer flex flex-col items-center  w-16 h-16 duration-300 border p-2 rounded-md 
                ${
                  formatDate(selectedDate) === formatDate(date)
                    ? "bg-primary-light text-white"
                    : "bg-white text-gray-400 hover:text-gray-600"
                }`}
            >
              <div className="text-xl font-semibold">{dayNumber}</div>
              <div className="font-semibold text-xs">{day}</div>
              {/* {formatDate(selectedDate) === formatDate(date) && (
                <div className="mt-1 rounded-full h-2 w-2 bg-primary-light"></div>
              )} */}
            </div>
          ))}
        </div>
        <button
          onClick={nextWeek}
          className="px-3 py-2 text-gray-400 hover:text-gray-600"
        >
          <FaAngleRight size={25} />
        </button>
        <div
          onClick={onAddPressed}
          className="w-14 h-14 flex items-center justify-center bg-primary-light text-white hover:bg-primary rounded-md"
        >
          <IoMdAdd size={22} />
        </div>
      </div>
    </div>
  );
}

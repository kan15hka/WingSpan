import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarDays } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  convertTime,
  formatDate,
  formatTimeTo12Hour,
} from "../helper/formatter";

const EmployeeTable = ({ data, onCheckIn, onCheckOut }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedDateData = selectedDate && data.find((d) => d[selectedDate]);

  const dayRecords = selectedDateData
    ? selectedDateData[selectedDate].day_check_in_outs
    : [];
  const firstCheckIn = selectedDateData
    ? selectedDateData[selectedDate].first_check_in
    : "N/A";
  const lastCheckOut = selectedDateData
    ? selectedDateData[selectedDate].last_check_out
    : "N/A";
  const totalWorkedTime = selectedDateData
    ? selectedDateData[selectedDate].total_worked_time
    : "N/A";

  return (
    <div className="mt-3 mx-auto w-10/12 flex flex-col items-center p-4">
      {/* Date Picker Dropdown */}
      <div className="flex w-full items-center">
        <div className="relative  ">
          {/* Calender */}
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-10 h-10 flex items-center justify-center bg-primary-light hover:bg-primary text-white rounded-md"
          >
            <FaCalendarDays size={18} />
          </div>
          {showCalendar && (
            <div
              className={`absolute z-10 duration-300 ${
                showCalendar
                  ? "opacity-100 top-10 left-10"
                  : "opacity-0 top-0 left-0"
              }`}
            >
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  const formattedDate = date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
                  console.log("Selected Date:", formattedDate);
                  setSelectedDate(formattedDate);
                  setShowCalendar(false);
                }}
                inline
              />
            </div>
          )}
        </div>

        <div className="ml-2 flex-1 flex items-center">
          {new Date().toISOString().split("T")[0] === selectedDate && (
            <div className="flex gap-2">
              <div className="primary-button" onClick={onCheckIn}>
                Checkin
              </div>
              <div className="primary-button" onClick={onCheckOut}>
                CheckOut
              </div>
            </div>
          )}
          <div className="ml-auto w-fit border rounded-md px-3 py-1.5 text-sm">
            Selected Date: {formatDate(selectedDate)}
          </div>
        </div>
      </div>
      <div className="mt-4 mb-2 w-full flex justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">First Check-In: </div>
          <div className="text-sm font-medium">
            {formatTimeTo12Hour(firstCheckIn)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Last Check-Out: </div>
          <div className="text-sm font-medium">
            {formatTimeTo12Hour(lastCheckOut)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Total Worked Time: </div>
          <div className="text-sm font-medium">
            {convertTime(totalWorkedTime)}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="w-full overflow-x-auto h-full  border rounded-md ">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr className="border-b text-sm text-primary-light">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Check-in Time</th>
              <th className="px-4 py-2 text-left">Check-out Time</th>
              <th className="px-4 py-2 text-left">Worked Time</th>
            </tr>
          </thead>
          <tbody>
            {dayRecords.length > 0 ? (
              dayRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b text-gray-800 text-sm hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{record.id}</td>
                  <td className="px-4 py-2">
                    {formatTimeTo12Hour(record.check_in_time)}
                  </td>
                  <td className="px-4 py-2">
                    {record.check_out_time
                      ? formatTimeTo12Hour(record.check_out_time)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {convertTime(record.worked_time)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-sm py-4 text-gray-500"
                >
                  No records available for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarDays } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import {
  convertTime,
  formatDate,
  formatTimeTo12Hour,
} from "../helper/formatter";

const AdminTable = ({ data }) => {
  const [selectedEmpName, setSelectedEmpName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract records for the selected date
  const selectedDateData = data
    .map((employee) => {
      const checkInOutEntry = employee.check_in_outs.find(
        (entry) => entry[selectedDate]
      );
      if (!checkInOutEntry) return null;

      return {
        id: employee.id,
        name: employee.name,
        username: employee.phone_number, // Assuming phone number as a unique identifier
        job_title: employee.job_title,
        first_check_in: checkInOutEntry[selectedDate].first_check_in,
        last_check_out: checkInOutEntry[selectedDate].last_check_out,
        total_worked_time: checkInOutEntry[selectedDate].total_worked_time,
        logs: checkInOutEntry[selectedDate].day_check_in_outs,
      };
    })
    .filter(Boolean);

  return (
    <div className="mt-3 mx-auto w-full flex flex-col items-center p-4">
      {/* Date Picker Dropdown */}
      <div className="flex w-full items-center">
        <div className="relative">
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-10 h-10 flex items-center justify-center bg-primary-light hover:bg-primary text-white rounded-md"
          >
            <FaCalendarDays size={18} />
          </div>
          {showCalendar && (
            <div className="absolute z-10 top-10 left-10">
              <DatePicker
                selected={new Date(selectedDate)}
                onChange={(date) => {
                  const formattedDate = date.toISOString().split("T")[0];
                  setSelectedDate(formattedDate);
                  setShowCalendar(false);
                }}
                inline
              />
            </div>
          )}
        </div>
        <div className="ml-2 flex-1 flex justify-end">
          <div className="ml-auto border rounded-md px-3 py-1.5 text-sm">
            Selected Date: {formatDate(selectedDate)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 w-full overflow-x-auto border rounded-md">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr className="border-b text-sm text-primary-light">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">First Check-In</th>
              <th className="px-4 py-2 text-left">Last Check-Out</th>
              <th className="px-4 py-2 text-left">Total Work Time</th>
              <th className="px-4 py-2 text-left">Logs</th>
            </tr>
          </thead>
          <tbody>
            {selectedDateData.length > 0 ? (
              selectedDateData.map((record, index) => (
                <tr
                  key={index}
                  className="border-b text-gray-800 text-sm hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{record.id}</td>
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">{record.username}</td>
                  <td className="px-4 py-2">{record.job_title}</td>
                  <td className="px-4 py-2">
                    {formatTimeTo12Hour(record.first_check_in)}
                  </td>
                  <td className="px-4 py-2">
                    {record.last_check_out !== "N/A"
                      ? formatTimeTo12Hour(record.last_check_out)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {convertTime(record.total_worked_time)}
                  </td>
                  <td className="px-4 py-2">
                    <IoMdMore
                      className="cursor-pointer text-xl text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        setSelectedEmpName(record.name);
                        setSelectedLogs(record.logs);
                        setIsModalOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-sm py-4 text-gray-500"
                >
                  No records available for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Logs Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <div className="text-lg font-semibold ">Check In/Out Logs</div>{" "}
            <div className="text-sm text-gray-500 mb-3">
              {selectedEmpName}'s Attendance Logs on {selectedDate}
            </div>
            <div className="border rounded-md">
              <table className="min-w-full bg-white rounded-md">
                <thead>
                  <tr className="border-b text-sm text-primary-light">
                    <th className="px-4 py-2 text-left">Check-In Time</th>
                    <th className="px-4 py-2 text-left">Check-Out Time</th>
                    <th className="px-4 py-2 text-left">Work Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLogs.length > 0 ? (
                    selectedLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="border-b text-gray-800 text-sm hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">
                          {formatTimeTo12Hour(log.check_in_time)}
                        </td>
                        <td className="px-4 py-2">
                          {formatTimeTo12Hour(log.check_in_time)}
                        </td>
                        <td className="px-4 py-2">
                          {convertTime(log.worked_time)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-sm py-4 text-gray-500"
                      >
                        No logs available for the selected date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-primary-light text-white px-4 py-2 rounded-md w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;

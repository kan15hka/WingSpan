import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdPlusOne } from "react-icons/md";
import { modalType, toastType } from "../../helper/helper";
import UserModal from "./UserModal";
import axios from "axios";
import { axiosInstance } from "../../apis/axiosInstance";
import { useToast } from "../../components/Toast/ToastService";

const UsersTable = ({ data, onTableDeletePressed }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userData, setUserData] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const toast = useToast();
  const [showColumns, setShowColumns] = useState({
    id: true,
    name: true,
    dob: true,
    contact: true,
    gender: true,
    username: true,
    nationality: true,
  });
  const [openModal, setOpenModal] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const toggleColumn = (column) => {
    setShowColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(nameFilter.toLowerCase())
  );
  const getUserBookings = async (userId) => {
    try {
      const response = await axiosInstance.get(`/user_bookings/${userId}`);
      const bookingsList = response.data["bookings"];
      setUserBookings(bookingsList);
      console.log(response);
    } catch (error) {
      console.error("Profile error:", error);
      setOpenModal(false);
      toast.open(
        error?.response?.data?.message || "Bookings fetch failed",
        toastType.ERROR
      );
    } finally {
      setOpenMenuId(false);
    }
  };

  return (
    <div className="mx-auto min-w-[950px]  flex flex-col text-center p-4">
      {/* Filter & Column Controls */}
      <div className="flex w-full mb-4 gap-4">
        {/* Name Filter Input */}
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1 text-sm"
        />

        {/* Column Selection Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            className="px-4 py-2 border rounded-md flex items-center text-sm bg-white"
          >
            Columns <IoMdArrowDropdown className="ml-2" />
          </button>
          {showColumnDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10 border">
              {Object.keys(showColumns).map((col) => (
                <label
                  key={col}
                  className="flex items-center px-4 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={showColumns[col]}
                    onChange={() => toggleColumn(col)}
                    className="mr-2"
                  />
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Add Crew */}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto h-full ">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr className="border-b text-sm text-primary-light">
              {showColumns.id && <th className="px-4 py-2 text-center">Id</th>}
              {showColumns.name && (
                <th className="px-4 py-2 text-center">Name</th>
              )}
              {showColumns.username && (
                <th className="px-4 py-2 text-center">Username</th>
              )}
              {showColumns.dob && (
                <th className="px-4 py-2 text-center">DOB</th>
              )}
              {showColumns.gender && (
                <th className="px-4 py-2 text-center">Gender</th>
              )}
              {showColumns.contact && (
                <th className="px-4 py-2 text-center">Contact</th>
              )}
              {showColumns.nationality && (
                <th className="px-4 py-2 text-center">Nationality</th>
              )}

              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr
                key={user.id}
                className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
              >
                {showColumns.id && <td className="px-4 py-2">{user.id}</td>}
                {showColumns.name && <td className="px-4 py-2">{user.name}</td>}
                {showColumns.username && (
                  <td className="px-4 py-2 capitalize">{user.username}</td>
                )}
                {showColumns.dob && (
                  <td className="px-4 py-2">{user.dob || "N/A"}</td>
                )}
                {showColumns.gender && (
                  <td className="px-4 py-2">{user.gender}</td>
                )}
                {showColumns.contact && (
                  <td className="px-4 py-2">{user.contact_number}</td>
                )}
                {showColumns.nationality && (
                  <td className="px-4 py-2">{user.nationality || "N/A"}</td>
                )}
                <td className="relative">
                  <button
                    onClick={() => toggleMenu(user.id)}
                    className="text-gray-600 focus:outline-none"
                  >
                    <HiDotsHorizontal />
                  </button>
                  {openMenuId === user.id && (
                    <div className="absolute right-2 mt-2 w-32 bg-white shadow-lg rounded-md py-2 z-10 border">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                        Actions
                      </p>

                      <button
                        onClick={() => {
                          onTableDeletePressed(user.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setUserData(user);
                          getUserBookings(user.id);
                          setOpenModal(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Bookings
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserModal
        open={openModal}
        setOpen={setOpenModal}
        userBookings={userBookings}
        user={userData}
        getUserBookings={getUserBookings}
      />
    </div>
  );
};

export default UsersTable;

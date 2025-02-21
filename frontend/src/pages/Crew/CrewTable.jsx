import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdPlusOne } from "react-icons/md";
import { modalType } from "../../helper/helper";

const CrewTable = ({ data, setModalData, onTableDeletePressed }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [showColumns, setShowColumns] = useState({
    id: true,
    name: true,
    role: true,
    contact: true,
    license: true,
    status: true,
  });
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

  const filteredData = data.filter(
    (crew) =>
      crew.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (selectedRole === "All" || crew.role === selectedRole)
  );

  const uniqueRoles = ["All", ...new Set(data.map((crew) => crew.role))];

  return (
    <div className="h-full flex flex-col items-center p-4">
      {/* Filter & Column Controls */}
      <div className="flex w-10/12 mb-4 gap-4">
        {/* Name Filter Input */}
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1 text-sm"
        />

        {/* Role Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="px-4 py-2 border rounded-md flex items-center text-sm bg-white"
          >
            Role: {selectedRole} <IoMdArrowDropdown className="ml-2" />
          </button>
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10 border">
              {uniqueRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

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
        <div
          onClick={() => {
            setModalData({
              open: true,
              type: modalType.ADD,
              data: null,
            });
          }}
          className="px-4 py-2 border rounded-md flex items-center text-base hover:bg-primary text-white font-semibold bg-primary-light"
        >
          +{" "}
        </div>
      </div>

      {/* Table */}
      <div className="w-10/12 overflow-x-auto h-full ">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr className="border-b text-sm text-primary-light">
              {showColumns.id && <th className="px-4 py-2 text-left">Id</th>}
              {showColumns.name && (
                <th className="px-4 py-2 text-left">Name</th>
              )}
              {showColumns.role && (
                <th className="px-4 py-2 text-left">Role</th>
              )}
              {showColumns.contact && (
                <th className="px-4 py-2 text-left">Contact</th>
              )}
              {showColumns.license && (
                <th className="px-4 py-2 text-left">License</th>
              )}
              {showColumns.status && (
                <th className="px-4 py-2 text-left">Status</th>
              )}
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((crew) => (
              <tr
                key={crew.id}
                className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
              >
                {showColumns.id && <td className="px-4 py-2">{crew.id}</td>}
                {showColumns.name && <td className="px-4 py-2">{crew.name}</td>}
                {showColumns.role && (
                  <td className="px-4 py-2 capitalize">{crew.role}</td>
                )}
                {showColumns.contact && (
                  <td className="px-4 py-2">{crew.contact_number}</td>
                )}
                {showColumns.license && (
                  <td className="px-4 py-2">{crew.license_number || "N/A"}</td>
                )}
                {showColumns.status && (
                  <td className="px-4 py-2">{crew.status}</td>
                )}
                <td className="relative">
                  <button
                    onClick={() => toggleMenu(crew.id)}
                    className="text-gray-600 focus:outline-none"
                  >
                    <HiDotsHorizontal />
                  </button>

                  {openMenuId === crew.id && (
                    <div className="absolute right-2 mt-2 w-32 bg-white shadow-lg rounded-md py-2 z-10 border">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                        Actions
                      </p>
                      <button
                        onClick={() => {
                          setOpenMenuId(false);
                          setModalData({
                            open: true,
                            type: modalType.EDIT,
                            data: crew,
                          });
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onTableDeletePressed(crew.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrewTable;

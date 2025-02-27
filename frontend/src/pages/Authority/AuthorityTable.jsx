import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdPlusOne } from "react-icons/md";
import { modalType, toastType } from "../../helper/helper";
import { useToast } from "../../components/Toast/ToastService";

const AuthorityTable = ({ data, setModalData, onTableDeletePressed }) => {
  const toast = useToast();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [showColumns, setShowColumns] = useState({
    id: true,
    name: true,
    role: true,
    username: true,
    regNo: true,
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
    (authority) =>
      authority.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (selectedRole === "All" || authority.role === selectedRole)
  );

  const uniqueRoles = [
    "All",
    ...new Set(data.map((authority) => authority.role)),
  ];

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

        {/* Add authority */}
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
              {showColumns.role && (
                <th className="px-4 py-2 text-center">Role</th>
              )}
              {showColumns.regNo && (
                <th className="px-4 py-2 text-center">RegNo</th>
              )}

              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((authority) => (
              <tr
                key={authority.id}
                className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
              >
                {showColumns.id && (
                  <td className="px-4 py-2">{authority.id}</td>
                )}
                {showColumns.name && (
                  <td className="px-4 py-2">{authority.name}</td>
                )}
                {showColumns.username && (
                  <td className="px-4 py-2">{authority.username}</td>
                )}
                {showColumns.role && (
                  <td className="px-4 py-2 capitalize">{authority.role}</td>
                )}
                {showColumns.regNo && (
                  <td className="px-4 py-2">{authority.reg_no || "N/A"}</td>
                )}

                <td className="relative">
                  <button
                    onClick={() => toggleMenu(authority.id)}
                    className="text-gray-600 focus:outline-none"
                  >
                    <HiDotsHorizontal />
                  </button>

                  {openMenuId === authority.id && (
                    <div className="absolute right-2 mt-2 w-32 bg-white shadow-lg rounded-md py-2 z-10 border">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                        Actions
                      </p>

                      <button
                        onClick={() => {
                          if (authority.role === "admin") {
                            toast.open(
                              "Admin Credentials cannot be deleted. You need special permissions",
                              toastType.ERROR
                            );
                          }
                          onTableDeletePressed(authority.id);
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

export default AuthorityTable;

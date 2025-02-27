import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  isValidName,
  isValidPassword,
  isValidUsername,
  modalType,
} from "../../helper/helper";
import Modal from "../../components/Modal";

export default function AuthorityModal({ modalData, onAddAuthority, onClose }) {
  const [error, setError] = useState(null);

  // Crew Fields
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState("");
  const [role, setRole] = useState("");

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleOptions = ["Admin", "Staff"];

  const validateForm = () => {
    setError(null);

    if (name.length < 4)
      return setError("Name must be at least 4 characters long.");
    const unRegex = /^(?=.*[a-z])(?=.*\d).{3,}$/;
    if (!unRegex.test(username))
      return setError(
        "Username must be at least 3 characters long and contain at least one lowercase letter and one digit."
      );
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!pwdRegex.test(password))
      return setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit."
      );
    if (!regNo.trim()) return setError("Register Number is required.");
    if (!role) return setError("Role is required.");
    return true;
  };

  const onAddAuthorityClicked = async () => {
    if (!validateForm()) return;

    const authorityData = {
      name: name,
      reg_no: regNo,
      username: username,
      password: password,
      role: role.toLocaleLowerCase(),
    };
    onAddAuthority(authorityData);
  };

  return (
    <Modal open={modalData.open} onClose={onClose}>
      <div className="w-96">
        <p className="text-lg font-semibold mb-4">ADD AUTHORITY</p>

        <div className="flex flex-col gap-3">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">NAME</label>
            <input
              type="text"
              className="input-box"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>{" "}
          {/* UserName Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              USERNAME
            </label>
            <input
              type="text"
              className="input-box"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>{" "}
          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              PASSWORD
            </label>
            <input
              type="text"
              className="input-box"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            {/* Register Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                REGISTER NUMBER
              </label>
              <input
                type="text"
                className="input-box"
                placeholder="STAFF-1234"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>

            {/* Role Dropdown */}
            <div className="relative flex-1">
              <label className="text-xs font-semibold text-gray-600">
                ROLE
              </label>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="input-box w-full flex items-center justify-between"
              >
                {role || "Select Role"}
                <IoMdArrowDropdown className="text-gray-600" />
              </button>
              {showRoleDropdown && (
                <div className="absolute w-full bg-white shadow-md rounded-md mt-1 z-10 border">
                  {roleOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setRole(option);
                        setShowRoleDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Error Message */}
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={onAddAuthorityClicked}
          className="mt-4 p-2 w-full text-white bg-primary-light hover:bg-primary rounded-md font-semibold"
        >
          Add Authority
        </button>
      </div>
    </Modal>
  );
}

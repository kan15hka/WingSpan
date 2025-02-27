import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { modalType } from "../../helper/helper";
import Modal from "../../components/Modal";

export default function CrewModal({
  modalData,
  onAddCrew,
  onEditCrew,
  onClose,
}) {
  const [error, setError] = useState(null);

  // Crew Fields
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const roleOptions = ["Pilot", "Co-Pilot", "Flight-Attendant"];
  const statusOptions = ["Active", "Inactive"];

  useEffect(() => {
    if (modalData.open && modalData.data) {
      setName(modalData.data.name || "");
      setContactNumber(modalData.data.contact_number || "");
      setLicenseNumber(modalData.data.license_number || "");
      setRole(modalData.data.role || "");
      setStatus(modalData.data.status || "");
    } else {
      // Reset fields when adding new crew
      setName("");
      setContactNumber("");
      setLicenseNumber("");
      setRole("");
      setStatus("");
    }
    setError(null);
  }, [modalData.open, modalData.data]);

  const validateForm = () => {
    setError(null);
    if (!name.trim()) return setError("Name is required.");
    if (!licenseNumber.trim()) return setError("License Number is required.");
    if (!contactNumber.trim()) return setError("Contact Number is required.");
    if (!role) return setError("Role is required.");
    if (!status) return setError("Status is required.");
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      name: name,
      contact_number: contactNumber,
      license_number: licenseNumber,
      role: role.toLowerCase(),
      status: status.toLowerCase(),
    };
    if (modalData.type === modalType.ADD) {
      onAddCrew(data);
    } else {
      onEditCrew(data, modalData.data?.id);
    }
  };

  return (
    <Modal open={modalData.open} onClose={onClose}>
      <div>
        <p className="text-lg font-semibold mb-4">
          {modalData.type === modalType.ADD
            ? "ADD CREW MEMBER"
            : "EDIT CREW MEMBER"}
        </p>

        <div className="flex flex-col gap-3">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">NAME</label>
            <input
              type="text"
              className="input-box"
              placeholder="Tyler Durden"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* License Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                LICENSE NUMBER
              </label>
              <input
                type="text"
                className="input-box"
                placeholder="LIC123456"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>

            {/* Contact Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                CONTACT NUMBER
              </label>
              <input
                type="text"
                className="input-box"
                placeholder="123-456-7890"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            {" "}
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
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Status Dropdown */}
            <div className="relative flex-1">
              <label className="text-xs font-semibold text-gray-600">
                STATUS
              </label>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="input-box w-full flex items-center justify-between"
              >
                {status || "Select Status"}
                <IoMdArrowDropdown className="text-gray-600" />
              </button>
              {showStatusDropdown && (
                <div className="absolute w-full bg-white shadow-md rounded-md mt-1 z-10 border">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setStatus(option);
                        setShowStatusDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
          onClick={onSubmit}
          className="mt-4 p-2 w-full text-white bg-primary-light hover:bg-primary rounded-md font-semibold"
        >
          {modalData.type === modalType.ADD
            ? "ADD CREW MEMBER"
            : "EDIT CREW MEMBER"}
        </button>
      </div>
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { MdClose } from "react-icons/md";
import { addAirplanes } from "../../apis/airplaneApi";
import { base64ToFile, modalType } from "../../helper/helper";

export default function AirplaneModal({
  modalData,
  onAddAirplane,
  onEditAirplane,
  onClose,
}) {
  const [error, setError] = useState(null);

  // Airplane Fields
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [airline, setAirline] = useState("");
  const [passengerCapacity, setPassengerCapacity] = useState("");
  const [crewCapacity, setCrewCapacity] = useState("");
  const [image, setImage] = useState(null);

  // Reset fields when modal closes
  useEffect(() => {
    if (modalData.open) {
      setModel(modalData.data?.model || "");
      setManufacturer(modalData.data?.manufacturer || "");
      setAirline(modalData.data?.airline || "");
      setPassengerCapacity(modalData.data?.passenger_capacity || "");
      setCrewCapacity(modalData.data?.crew_capacity || "");
    }
    const imageFile = modalData.data?.image_data
      ? base64ToFile(
          modalData.data.image_data,
          `${modalData.data.id}_image.jpg`
        )
      : null;

    setImage(imageFile);
    setError(null);
  }, [modalData.open]);

  const validateForm = () => {
    setError(null);
    const parsedPassengerCapacity = Number(passengerCapacity);
    const parsedCrewCapacity = Number(crewCapacity);

    if (!model.trim()) return setError("Model is required.");
    if (!manufacturer.trim()) return setError("Manufacturer is required.");
    if (!airline.trim()) return setError("Airline is required.");
    if (!parsedPassengerCapacity || parsedPassengerCapacity <= 0)
      return setError("Passenger capacity must be a positive number.");
    if (!parsedCrewCapacity || parsedCrewCapacity <= 0)
      return setError("Crew capacity must be a positive number.");

    // Validate image
    if (!image) return setError("Please upload an image.");
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (!validExtensions.includes(image.type))
      return setError("Invalid file format. Please upload a JPG or PNG image.");

    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("model", model);
    formData.append("manufacturer", manufacturer);
    formData.append("airline", airline);
    formData.append("passenger_capacity", passengerCapacity);
    formData.append("crew_capacity", crewCapacity);
    formData.append("image", image); // Append image file

    if (modalData.type == modalType.ADD) {
      onAddAirplane(formData);
    } else {
      onEditAirplane(formData, modalData.data?.id);
    }
  };

  return (
    <Modal open={modalData.open} onClose={onClose}>
      <div>
        <p className="text-lg font-semibold mb-4">
          {modalData.type == modalType.ADD ? "ADD AIRPLANE" : "EDIT AIRPLANE"}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {/* Model Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                MODEL
              </label>
              <input
                type="text"
                className="input-box"
                placeholder="Boeing 737"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            {/* Manufacturer Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                MANUFACTURER
              </label>
              <input
                type="text"
                className="input-box"
                placeholder="Boeing"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
          </div>

          {/* Airline Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              AIRLINE
            </label>
            <input
              type="text"
              className="input-box"
              placeholder="Delta Airlines"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* Passenger Capacity Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                PASSENGER CAPACITY
              </label>
              <input
                type="number"
                className="input-box"
                placeholder="180"
                value={passengerCapacity}
                onChange={(e) => setPassengerCapacity(e.target.value)}
              />
            </div>
            {/* Crew Capacity Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                CREW CAPACITY
              </label>
              <input
                type="number"
                className="input-box"
                placeholder="10"
                value={crewCapacity}
                onChange={(e) => setCrewCapacity(e.target.value)}
              />
            </div>
          </div>

          {/* Image File Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              IMAGE FILE
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <div className="relative h-32 w-full bg-gray-200 rounded-md flex items-center justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="airplaneImg"
                  className="h-full w-full object-contain"
                />
                <div
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 bg-primary-light p-1 rounded-full hover:bg-primary text-white duration-300"
                >
                  <MdClose />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="mt-4 p-2 w-full text-white bg-primary-light hover:bg-primary rounded-md font-semibold"
        >
          {modalData.type == modalType.ADD ? "ADD AIRPLANE" : "EDIT AIRPLANE"}
        </button>
      </div>
    </Modal>
  );
}

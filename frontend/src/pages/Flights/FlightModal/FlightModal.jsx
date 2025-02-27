import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Modal from "../../../components/Modal";
import { modalType, toastType } from "../../../helper/helper";
import AddPlane from "./AddPlane";
import AddFlight from "./AddFlight";
import AddCrew from "./AddCrew";
import { useToast } from "../../../components/Toast/ToastService";
import { formatDate, mergeIds } from "../../../helper/formatter";
import { addFlight, editFlight } from "../../../apis/flightsApi";

export default function FlightModal({
  modalData,
  setModalData,
  planes,
  crew,
  selectedDate,
  fetchFlights,
}) {
  //AddPlane fields
  const [selectedPlaneId, setSelectedPlaneId] = useState(null);

  //Add Flight Fields
  const [fromCity, setFromCity] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [toCity, setToCity] = useState("");
  const [toCode, setToCode] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [price, setPrice] = useState("");
  const [flightError, setFlightError] = useState(null);

  //Add Crew Fields
  const [pilots, setPilots] = useState([]);
  const [coPilots, setCoPilots] = useState([]);
  const [flightAttendants, setFlightAttendants] = useState([]);
  const [crewError, setCrewError] = useState(null);

  const toast = useToast();
  const [pageIndex, setPageIndex] = useState(1);

  const handleNext = () => setPageIndex((pageIndex) => pageIndex + 1);
  const handlePrev = () => setPageIndex((pageIndex) => pageIndex - 1);

  useEffect(() => {
    if (modalData.open && modalData.data) {
      //Plane
      setSelectedPlaneId(modalData.data.airplane.id || null);
      //Flight
      setFromCity(modalData.data.from_city || "");
      setFromCode(modalData.data.from_code || "");
      setToCity(modalData.data.to_city || "");
      setToCode(modalData.data.to_code || "");
      setFromTime(modalData.data.from_time || "");
      setToTime(modalData.data.to_time || "");
      setPrice(parseInt(modalData.data.price) || "");
      //Crew
    } else {
      // Reset fields when adding new crew
      //Plane
      setSelectedPlaneId(null);
      //Flight
      setFromCity("");
      setFromCode("");
      setToCity("");
      setToCode("");
      setFromTime("");
      setToTime("");
      setPrice("");
    }
    setFlightError(null);
    setCrewError(null);
  }, [modalData.open, modalData.data]);
  const onClose = () => {
    setSelectedPlaneId(null);
    setFromCity("");
    setFromCode("");
    setToCity("");
    setToCode("");
    setFromTime("");
    setToTime("");
    setPrice("");
    setFlightError(null);
    setPilots([]);
    setCoPilots([]);
    setFlightAttendants([]);
    setCrewError(null);
    setPageIndex(1);

    setModalData({
      open: false,
      type: modalType.ADD,
      data: null,
    });
  };

  const onAddPlanePressed = () => {
    if (!selectedPlaneId) {
      toast.open("Select an airplane to proceed.", toastType.ERROR);
      return;
    }
    handleNext();
  };

  const validateFlightForm = () => {
    setFlightError(null);

    if (!fromCity.trim()) return setFlightError("Departure city is required.");
    if (!toCity.trim()) return setFlightError("Destination city is required.");
    if (fromCity === toCity)
      return setFlightError("Source and destination city cannot be same.");
    if (!fromCode.trim())
      return setFlightError("Departure airport code is required.");
    if (!toCode.trim())
      return setFlightError("Destination airport code is required.");
    if (fromTime === toTime)
      return setFlightError("Source and destination time cannot be same.");
    if (!fromTime.trim()) return setFlightError("Departure time is required.");
    if (!toTime.trim()) return setFlightError("Arrival time is required.");
    if (!price || price <= 0) return setFlightError("Price is required.");

    return true;
  };

  const onAddFlightPressed = () => {
    if (!validateFlightForm()) return;

    handleNext();
  };
  const onAddOrEditPressed = () => {
    setCrewError(null);
    if (pilots.length != 2) return setCrewError("Add 2 Pilots to proceed.");
    if (coPilots.length != 2)
      return setCrewError("Add 2 Co Pilots to proceed.");
    if (flightAttendants.length != 5)
      return setCrewError("Add 5 Flight Attenders to proceed.");

    const crewIds = mergeIds(pilots, coPilots, flightAttendants);

    const newFlightData = {
      airplane_id: selectedPlaneId,
      crew_ids: crewIds,
      date: selectedDate,
      from_city: fromCity,
      from_code: fromCode,
      from_time: fromTime,
      to_city: toCity,
      to_code: toCode,
      to_time: toTime,
      price: price,
    };
    if (modalData.type === modalType.ADD) {
      onAddFlight(newFlightData);
    } else {
      onEditFlight(newFlightData, modalData?.data?.id);
    }
  };

  const onAddFlight = async (flightData) => {
    try {
      console.log(flightData);
      const data = await addFlight(flightData);
      toast.open(
        data.message || "Flight added successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error adding flight.",
        toastType.ERROR
      );
    } finally {
      onClose();
      fetchFlights();
    }
  };
  const onEditFlight = async (flightData, flightId) => {
    try {
      const data = await editFlight(flightData, flightId);
      toast.open(
        data.message || "Flight edited successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error editing flight.",
        toastType.ERROR
      );
    } finally {
      onClose();
      fetchFlights();
    }
  };

  return (
    <Modal
      open={modalData.open}
      onClose={() => {
        setPageIndex(1);
        onClose();
      }}
    >
      <div>
        <p className="text-lg font-semibold ">
          {modalData.type === modalType.ADD
            ? "ADD FLIGHT SCHEDULE"
            : "EDIT FLIGHT SCHEDULE"}
        </p>
        <div className=" ">
          {pageIndex === 1 && (
            <AddPlane
              planes={
                // planes
                modalData.type === modalType.ADD
                  ? planes
                  : [...planes, modalData.data.airplane]
              }
              setSelectedPlaneId={setSelectedPlaneId}
              selectedPlaneId={selectedPlaneId}
            />
          )}
          {pageIndex === 2 && (
            <AddFlight
              error={flightError}
              fromCity={fromCity}
              setFromCity={setFromCity}
              fromCode={fromCode}
              setFromCode={setFromCode}
              toCity={toCity}
              setToCity={setToCity}
              toCode={toCode}
              setToCode={setToCode}
              fromTime={fromTime}
              setFromTime={setFromTime}
              toTime={toTime}
              setToTime={setToTime}
              price={price}
              setPrice={setPrice}
            />
          )}
          {pageIndex === 3 && (
            <AddCrew
              crew={
                modalData.type === modalType.ADD
                  ? crew
                  : [...crew, ...modalData.data.crew]
              }
              pilots={pilots}
              modalData={modalData}
              setPilots={setPilots}
              coPilots={coPilots}
              setCoPilots={setCoPilots}
              flightAttendants={flightAttendants}
              setFlightAttendants={setFlightAttendants}
              crewError={crewError}
            />
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={pageIndex === 1}
            className="px-4 py-2 duration-300 rounded-md text-sm  bg-gray-300 hover:bg-black hover:text-white disabled:hover:text-black disabled:hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {pageIndex === 1 && (
            <button
              onClick={onAddPlanePressed}
              className="px-4 py-2 text-sm rounded-md bg-primary-light text-white hover:bg-primary duration-300"
            >
              Next
            </button>
          )}{" "}
          {pageIndex === 2 && (
            <button
              onClick={onAddFlightPressed}
              className="px-4 py-2 text-sm rounded-md bg-primary-light text-white hover:bg-primary duration-300"
            >
              Next
            </button>
          )}
          {pageIndex === 3 && (
            <button
              onClick={onAddOrEditPressed}
              className="px-4 py-2 text-sm rounded-md bg-primary-light text-white hover:bg-primary duration-300"
            >
              {modalData.type === modalType.ADD ? "Add Flight" : "Edit Flight"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

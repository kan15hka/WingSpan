import React, { useEffect, useState } from "react";
import { categorizeCrewByRole } from "../../../helper/formatter";
import CrewDropDown from "./CrewDropDown";
import { crewType } from "../../../helper/helper";

export default function AddCrew({
  crewError,
  crew,
  modalData,
  pilots,
  setPilots,
  coPilots,
  setCoPilots,
  flightAttendants,
  setFlightAttendants,
}) {
  const [pilotList, setPilotList] = useState([]);
  const [coPilotList, setCoPilotList] = useState([]);
  const [flightAttendantList, setFlightAttendantList] = useState([]);

  useEffect(() => {
    if (modalData.data) {
      const {
        pilotList: pilotsLE,
        coPilotList: coPilotsLE,
        flightAttendantList: attendantsLE,
      } = categorizeCrewByRole(modalData.data.crew);
      setPilots(pilotsLE);
      setCoPilots(coPilotsLE);
      setFlightAttendants(attendantsLE);
    }
  }, [modalData.data]); // Only run when modalData.data changes

  useEffect(() => {
    const {
      pilotList: pilotsL,
      coPilotList: coPilotsL,
      flightAttendantList: attendantsL,
    } = categorizeCrewByRole(crew);

    // Set the crew lists only if they have changed
    setPilotList(pilotsL);
    setCoPilotList(coPilotsL);
    setFlightAttendantList(attendantsL);
  }, [crew]); // Only run when crew changes

  return (
    <div className="h-[450px]  overflow-y-scroll flex flex-col justify-between">
      <div className="flex-1 pb-12">
        <CrewDropDown
          type={crewType.PILOT}
          crewData={pilotList}
          crewMax={2}
          addedCrew={pilots}
          setAddedCrew={setPilots}
        />
        <div className="w-full h-[1px] bg-gray-300"></div>
        <CrewDropDown
          type={crewType.COPILOT}
          crewData={coPilotList}
          crewMax={2}
          addedCrew={coPilots}
          setAddedCrew={setCoPilots}
        />{" "}
        <div className="w-full h-[1px] bg-gray-300"></div>
        <CrewDropDown
          type={crewType.FLIGHTATTENDANT}
          crewData={flightAttendantList}
          crewMax={5}
          addedCrew={flightAttendants}
          setAddedCrew={setFlightAttendants}
        />
      </div>
      {/* Error Message */}
      {crewError && <p className="text-red-600 text-xs mt-2">{crewError}</p>}
    </div>
  );
}

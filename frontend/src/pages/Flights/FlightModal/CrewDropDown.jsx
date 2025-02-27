import React, { useState } from "react";
import { LiaPlaneDepartureSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { crewType } from "../../../helper/helper";

export default function CrewDropDown({
  crewMax,
  type,
  crewData,
  addedCrew,
  setAddedCrew,
}) {
  const [error, setError] = useState(null);

  const [selectedCrew, setSelectedCrew] = useState(null);

  const [query, setQuery] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const addCrewList = () => {
    setError(null);
    if (!selectedCrew) {
      return setError(`Crew member field cannot be empty.`);
    } else {
      if (addedCrew.length == crewMax) {
        setSelectedCrew(null);
        setQuery("");
        return setError(
          `Only ${crewMax} ${
            type === crewType.PILOT
              ? "Pilots"
              : type === crewType.COPILOT
              ? "Co Pilots"
              : "Flight Attenders"
          } can be add maximum.`
        );
      }
      const isAlreadySelected = addedCrew.some(
        (crew) => selectedCrew.id === crew.id
      );
      if (isAlreadySelected) {
        setSelectedCrew(null);
        setQuery("");
        return setError(`Crew member already present.`);
      }
      setAddedCrew([...addedCrew, selectedCrew]);
      setSelectedCrew(null);
      setQuery("");
    }
  };

  const removeCrewList = (crewIdToRemove) => {
    setAddedCrew(addedCrew.filter((crew) => crew.id !== crewIdToRemove));
  };

  const filteredCrew = crewData.filter(
    (crew) =>
      crew.name.toLowerCase().includes(query.toLowerCase()) ||
      crew.license_number.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (crew) => {
    setSelectedCrew(crew);
    setQuery(`${crew.name} (${crew.license_number})`);
    setShowDropdown(false);
  };

  return (
    <div className=" my-3 flex-1 flex flex-col gap-1  w-96">
      <label className="text-xs font-semibold text-gray-600">
        {type === crewType.PILOT
          ? "PILOT"
          : type === crewType.COPILOT
          ? "CO PILOT"
          : "FLIGHT ATTENDANT"}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 ">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={
              type === crewType.PILOT
                ? "Add Pilots"
                : type === crewType.COPILOT
                ? "Add Co-Pilots"
                : "Add Flight Attenders"
            }
            onKeyDown={(target) => {
              if (target.key == "Enter") {
                addCrewList();
              }
            }}
            className="input-box w-full text-sm"
          />
          {showDropdown && query && (
            <ul className="absolute w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-md max-h-48 overflow-y-auto z-10">
              {filteredCrew.length > 0 ? (
                filteredCrew.map((crew) => {
                  return (
                    <li
                      key={crew.id}
                      onClick={() => handleSelect(crew)}
                      className=" cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex gap-2 p-2 border-b">
                        <div className="p-2 rounded-full bg-cutomGrey-light">
                          <LiaPlaneDepartureSolid size={22} />
                        </div>
                        <div>
                          <div className="text-sm">{crew.name}</div>
                          <div className="text-xs text-gray-600">
                            {crew.license_number}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="p-2 text-gray-500 text-sm">No matches found</li>
              )}
            </ul>
          )}
        </div>
        <div
          onClick={addCrewList}
          className="bg-primary-light rounded-md text-white font-semibold py-1 px-2 hover:bg-primary"
        >
          ADD
        </div>
      </div>{" "}
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      <div className=" w-full flex gap-2 flex-wrap mt-1">
        {addedCrew.map((crew) => {
          return (
            <div
              key={crew.id}
              className="border flex gap-2 bg-cutomGrey-light p-1 rounded-md items-center"
            >
              <div className="bg-white border font-semibold px-2 py-1 rounded-md">
                {type === crewType.PILOT
                  ? "PL"
                  : type === crewType.COPILOT
                  ? "CP"
                  : "FA"}
              </div>
              <div className="flex flex-col">
                <div className="text-xs font-semibold">{crew.name}</div>
                <div className="text-[10px] text-gray-500">
                  {crew.license_number}
                </div>
              </div>{" "}
              <div
                onClick={() => {
                  removeCrewList(crew.id);
                }}
                className=" p-1 rounded-md bg-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <MdClose />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

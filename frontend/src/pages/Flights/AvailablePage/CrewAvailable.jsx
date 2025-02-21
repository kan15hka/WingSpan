import React from "react";
import { FaAngleLeft } from "react-icons/fa";

export default function CrewAvailable({ crewData, onBackClicked }) {
  return (
    <div className="flex-1">
      <div className=" flex gap-2">
        <div
          onClick={onBackClicked}
          className="bg-white border rounded-full p-1"
        >
          <FaAngleLeft />
        </div>
        <div className="font-semibold">Available Crew</div>
      </div>
      {crewData.length > 0 ? (
        <div className="mt-2 overflow-x-auto h-full ">
          <table className="min-w-full bg-white rounded-md">
            <thead>
              <tr className="border-b text-sm text-primary-light">
                <th className="px-4 py-2 text-left">Id</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">License</th>
              </tr>
            </thead>
            <tbody>
              {crewData.map((crew) => (
                <tr
                  key={crew.id}
                  className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
                >
                  <td className="px-4 py-2">{crew.id}</td>
                  <td className="px-4 py-2">{crew.name}</td>
                  <td className="px-4 py-2 capitalize">{crew.role}</td>
                  <td className="px-4 py-2">{crew.license_number || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 w-full  mx-auto max-w-80 text-center  text-sm text-gray-600 ">
          No available crew to schedule flight.
        </div>
      )}
    </div>
  );
}

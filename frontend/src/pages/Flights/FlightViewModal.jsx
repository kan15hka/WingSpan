import React from "react";
import { flightViewModalType } from "../../helper/helper";
import AirplaneCard from "../../components/AirplaneCard";
import Modal from "../../components/Modal";

export default function FlightViewModal({
  flightViewModalData,
  setFlightViewModalData,
}) {
  return (
    <Modal
      open={flightViewModalData.open}
      onClose={() => {
        setFlightViewModalData({
          open: false,
          type: flightViewModalType.AIRPLANE,
          data: null,
        });
      }}
    >
      <div className="flex flex-col">
        <div className=" font-semibold">
          {flightViewModalData.type === flightViewModalType.AIRPLANE
            ? "AIRPLANE DETAILS"
            : flightViewModalData.type === flightViewModalType.CREW
            ? "CREW DETAILS"
            : "BOOKING DETAILS"}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {" "}
          {flightViewModalData.type === flightViewModalType.AIRPLANE
            ? "Airplane details of the flight."
            : flightViewModalData.type === flightViewModalType.CREW
            ? "Crews assigned to this flight."
            : "Users list who booked this flight."}
        </div>
        {flightViewModalData.type === flightViewModalType.AIRPLANE ? (
          <AirplaneCard
            airplane={flightViewModalData.data}
            isEditable={false}
          />
        ) : flightViewModalData.type === flightViewModalType.CREW ? (
          <div className="mt-2 overflow-x-auto h-full  border rounded-md">
            {flightViewModalData.data.length > 0 ? (
              <div className="">
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
                    {flightViewModalData.data.map((crew) => (
                      <tr
                        key={crew.id}
                        className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
                      >
                        <td className="px-4 py-2">{crew.id}</td>
                        <td className="px-4 py-2">{crew.name}</td>
                        <td className="px-4 py-2 capitalize">{crew.role}</td>
                        <td className="px-4 py-2">
                          {crew.license_number || "N/A"}
                        </td>
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
        ) : (
          <div className="mt-2 border rounded-md">
            {flightViewModalData.data.length > 0 ? (
              <div className=" overflow-x-auto h-full ">
                <table className="min-w-full bg-white rounded-md">
                  <thead>
                    <tr className="border-b text-sm text-primary-light">
                      <th className="px-4 py-2 text-left">Id</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Gender</th>
                      <th className="px-4 py-2 text-left">Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightViewModalData.data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b text-gray-800 text-sm hover:bg-gray-50 relative"
                      >
                        <td className="px-4 py-2">{user.id}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">{user.gender}</td>
                        <td className="px-4 py-2">{user.nationality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 w-full  mx-auto max-w-80 text-center  text-sm text-gray-600 ">
                No users have booked this flight.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

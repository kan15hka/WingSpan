import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const BookingHeadCount = ({ count, setCount }) => {
  const [adultCount, setAdultCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative w-48 m-4 flex gap-2 items-center">
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">
          Passengers count
        </label>
        <div className="relative w-full">
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className={`w-full cursor-pointer ${
              count > 0 ? "text-black" : "text-gray-400"
            }`}
          >
            {count > 0
              ? `${count} Passenger${count > 1 ? "s" : ""}`
              : "Add Count"}
          </div>

          {showDropdown && (
            <div className="absolute p-2 w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-md max-h-48 overflow-y-auto z-10">
              <div className="text-sm text-gray-500">Add passengers count</div>
              <div className="mt-2 flex items-center justify-between">
                <div>Adult</div>
                <div className="flex items-center">
                  <div
                    onClick={() => {
                      if (adultCount == 0) return;
                      setAdultCount(adultCount - 1);
                      setCount(count - 1);
                    }}
                    className="px-3 py-1 hover:bg-gray-300 cursor-pointer bg-cutomGrey-light rounded-md"
                  >
                    -
                  </div>
                  <div className="w-7 text-center">{adultCount}</div>
                  <div
                    onClick={() => {
                      setAdultCount(adultCount + 1);
                      setCount(count + 1);
                    }}
                    className="px-3 py-1 hover:bg-gray-300 cursor-pointer bg-cutomGrey-light rounded-md"
                  >
                    +
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>Children</div>
                <div className="flex items-center">
                  <div
                    onClick={() => {
                      if (childrenCount == 0) return;
                      setChildrenCount(childrenCount - 1);
                      setCount(count - 1);
                    }}
                    className="px-3 py-1 hover:bg-gray-300 cursor-pointer bg-cutomGrey-light rounded-md"
                  >
                    -
                  </div>
                  <div className="w-7 text-center">{childrenCount}</div>
                  <div
                    onClick={() => {
                      setChildrenCount(childrenCount + 1);
                      setCount(count + 1);
                    }}
                    className="px-3 py-1 hover:bg-gray-300 cursor-pointer bg-cutomGrey-light rounded-md"
                  >
                    +
                  </div>
                </div>{" "}
              </div>{" "}
              <div
                onClick={() => {
                  if (!count) return;
                  setShowDropdown(false);
                }}
                className="text-sm rounded-md bg-primary-light pz-2 py-2 cursor-pointer hover:bg-primary text-center text-white mt-3"
              >
                {" "}
                Add Count
              </div>
            </div>
          )}
        </div>
      </div>

      {count > 0 && (
        <div
          onClick={() => {
            setCount(0);
            setAdultCount(0);
            setChildrenCount(0);
            setShowDropdown(false);
          }}
          className="absolute top-1 right-1 cursor-pointer bg-gray-300 p-1 rounded-full hover:bg-gray-400"
        >
          <MdClose />
        </div>
      )}
    </div>
  );
};

export default BookingHeadCount;

import React, { useState } from "react";
import FlightBookingInputBox from "./FlightBookingInputBox";
import { FaPlaneDeparture } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import UserAuthCard from "../Components/UserAuthCard";
import { formatDateToddMonthYYYY } from "../../../helper/helper";
import Modal from "../../../components/Modal";
export default function FlightBookigHeader({
  fromCity,
  setFromCity,
  fromCode,
  setFromCode,
  toCity,
  setToCity,
  toCode,
  setToCode,
  date,
  setDate,
  count,
  setCount,
  onSearchClicked,
  onProfileClicked,
}) {
  const [showLoginDropDown, setShowLoginDropDown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <div className="bg-primary pt-8 px-16">
      <div className="relative flex justify-between">
        <div className="flex gap-2 items-center">
          <div>
            <img
              src="src/assets/logo.png"
              alt="logo "
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="text-white font-semibold text-lg">WingSpan</div>
        </div>
        <UserAuthCard onProfileClicked={onProfileClicked} />
      </div>
      <div className="mt-7 text-3xl font-semibold text-white">
        Millions of cheap flights. One simple search.
      </div>

      <div className="flex mt-5 items-center gap-3">
        {" "}
        <div
          onClick={() => {
            setShowSearchInput(!showSearchInput);
          }}
          className="cursor-pointer flex-1 bg-primary-light p-1.5 rounded-md flex items-center"
        >
          <div className="text-white p-1.5 rounded-md bg-primary">
            <IoSearch />
          </div>
          <div className="flex-1 text-white text-center">
            {fromCity && fromCode && toCity && toCode && count
              ? `${fromCity} (${fromCode}) - ${toCity} (${toCode}) ~ ${count} Passengers`
              : "Ready to take off? Choose your route!"}
          </div>
        </div>
        <div className="font-semibold text-white p-2 rounded-md ">
          {date && formatDateToddMonthYYYY(date)}
        </div>
      </div>

      {showSearchInput && (
        <div className="">
          <div className="mt-5 mb-2 flex items-center gap-1 text-white">
            <BiSolidPlaneAlt size={18} />
            <div className=" text-sm font-semibold text-white">
              Book your flight and embark on an adventure!
            </div>
          </div>
          <FlightBookingInputBox
            fromCity={fromCity}
            setFromCity={setFromCity}
            fromCode={fromCode}
            setFromCode={setFromCode}
            toCity={toCity}
            setToCity={setToCity}
            toCode={toCode}
            setToCode={setToCode}
            date={date}
            setDate={setDate}
            count={count}
            setCount={setCount}
            onSearchClicked={onSearchClicked}
          />
        </div>
      )}
      <div className="h-8"></div>
    </div>
  );
}

import React, { useState } from "react";
import FlightBookingInputBox from "./FlightBooking/FlightBookingInputBox";
import HomeHero from "../../components/HomeHero";
import { useToast } from "../../components/Toast/ToastService";
import {
  formatDate,
  formatDateToddMonthYYYY,
  toastType,
} from "../../helper/helper";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import ProfileModal from "./Components/ProfileModal";

export default function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [fromCity, setFromCity] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [toCity, setToCity] = useState("");
  const [toCode, setToCode] = useState("");
  const [date, setDate] = useState(null);
  const [count, setCount] = useState(0);

  const validateSearch = () => {
    let errorMessage = "";
    if (!fromCity || !fromCode) errorMessage = "Departure city is required.";
    else if (!toCity || !toCode) errorMessage = "Destination city is required.";
    else if (fromCity === toCity)
      errorMessage = "Departure and Destination city cannot be the same.";
    else if (!date) errorMessage = "Journey date is required.";
    else if (count < 1) errorMessage = "At least one passenger is required.";

    if (errorMessage) {
      toast.open(errorMessage, toastType.ERROR);
      return false;
    }
    return true;
  };

  const onSearch = () => {
    if (!validateSearch()) return;
    const searchData = {
      fromCity: fromCity,
      fromCode: fromCode,
      toCity: toCity,
      toCode: toCode,
      date: date,
      count: count,
    };
    navigate("/book-flights", { state: searchData });
  };

  const [showProfileModal, setShowProfileModal] = useState(false);

  const onProfileClicked = () => {
    setShowProfileModal(true);
  };

  return (
    <div>
      <div className="h-screen mx-auto  w-11/12 my-6">
        <HomeHero onProfileClicked={onProfileClicked} />
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
          onSearchClicked={onSearch}
        />
        <div className="text-center mt-5 text-gray-500">
          Book a flight and start your journey with us.
        </div>
      </div>
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightBookigHeader from "./FlightBookigHeader";
import { getPassengerFlights } from "../../../apis/flightsApi";
import { formatDate, formatFlightsByDate } from "../../../helper/formatter";
import HorizontalBookingCalendar from "./HorizontalBookingCalendar";
import FlightFiltersCard from "../../Flights/FlightFiltersCard";
import AirplaneCard from "../../../components/AirplaneCard";
import FlightBookingTicketCard from "../../../components/FlightBookingTicketCard";
import BookFlightModal from "./BookFlightModal";
import { useToast } from "../../../components/Toast/ToastService";
import { toastType } from "../../../helper/helper";
import Modal from "../../../components/Modal";
import ProfileModal from "../Components/ProfileModal";

export default function FlightBookingPage() {
  const location = useLocation();
  const searchData = location.state ?? {};
  const navigate = useNavigate();
  const toast = useToast();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passengerFlights, setPassengerFlights] = useState([]);
  const [passengerFlightsDateData, setPassengerFlightsDateData] = useState({});
  const [filteredPassengerFlights, setFilteredPassengerFlights] = useState([]);
  const [error, setError] = useState(null);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);

  const [fromCity, setFromCity] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [toCity, setToCity] = useState("");
  const [toCode, setToCode] = useState("");
  const [date, setDate] = useState(null);
  const [count, setCount] = useState(0);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const onProfileClicked = () => {
    setShowProfileModal(true);
  };

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

    setFromCity(fromCity);
    setFromCode(fromCode);
    setToCity(toCity);
    setToCode(toCode);
    setDate(date);
    setCount(count);

    filterFlights(fromCode, toCode, date);
  };

  const filterFlights = (fromCode, toCode, date) => {
    if (!date || !fromCode || !toCode) {
      setFilteredPassengerFlights([]);
      return;
    }

    const formattedDate = formatDate(date);
    if (passengerFlightsDateData[formattedDate]) {
      const filteredFlights = passengerFlightsDateData[formattedDate].filter(
        (flight) => flight.from_code === fromCode && flight.to_code === toCode
      );
      setFilteredPassengerFlights(filteredFlights);
    } else {
      setFilteredPassengerFlights([]);
    }
  };

  async function fetchPassengerFlights() {
    try {
      setLoading(true);
      const data = await getPassengerFlights();
      setPassengerFlights(data);
      const formattedData = formatFlightsByDate(data);
      setPassengerFlightsDateData(formattedData);
    } catch (error) {
      console.error(error);
      setError(
        "Oops! We couldn't load the flight data. Please try again in a bit."
      );
      setFilteredPassengerFlights([]);
    } finally {
      setLoading(false);
    }
  }

  // Initialize from search data
  useEffect(() => {
    if (searchData?.fromCity) setFromCity(searchData.fromCity);
    if (searchData?.fromCode) setFromCode(searchData.fromCode);
    if (searchData?.toCity) setToCity(searchData.toCity);
    if (searchData?.toCode) setToCode(searchData.toCode);
    if (searchData?.count) setCount(searchData.count);
    if (searchData?.date) setDate(searchData.date);
  }, [searchData]);

  // Fetch flights when date changes
  useEffect(() => {
    if (date) {
      fetchPassengerFlights();
    }
    setSelectedFlight(null);
    setSelectedFlightIndex(null);
  }, [date]);

  // Filter flights when relevant data changes
  useEffect(() => {
    filterFlights(fromCode, toCode, date);
  }, [passengerFlightsDateData, date, fromCode, toCode]);

  return (
    <div className="bg-cutomGrey-light pb-10">
      <FlightBookigHeader
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
        onProfileClicked={onProfileClicked}
      />
      <div className="px-14 pt-4">
        <HorizontalBookingCalendar
          selectedDate={date}
          setSelectedDate={setDate}
        />
        <div className="flex gap-3">
          <FlightFiltersCard />
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center mt-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary-light"></div>
              </div>
            ) : error ? (
              <div className="mt-10 text-red-600 text-center w-full mx-auto text-sm">
                {error}
              </div>
            ) : filteredPassengerFlights.length > 0 ? (
              filteredPassengerFlights.map((flight, index) => (
                <div
                  key={flight.id || index}
                  onClick={() => {
                    setSelectedFlight(flight);
                    setSelectedFlightIndex(index);
                  }}
                >
                  <FlightBookingTicketCard
                    flight={flight}
                    isSelectedtoBook={selectedFlightIndex === index}
                    onBookingClicked={() => {
                      setShowBookingModal(true);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="mt-10 text-gray-800 text-center w-full mx-auto text-sm">
                Oops! No flight schedules available at the moment. Try adjusting
                your search or add schedules.
              </div>
            )}
          </div>
          <div className="h-fit w-72">
            <div className="px-4 py-3 bg-white rounded-md">
              <div className="text font-medium">Flight Airplane Data</div>
              {selectedFlight ? (
                <div>
                  <div className="text-sm text-gray-500 mt-1 mb-2">
                    Airplane for flight from
                    <br />
                    {`${selectedFlight?.from_city}(${selectedFlight?.from_code}) - ${selectedFlight?.to_city}(${selectedFlight?.to_code})`}
                  </div>
                  <AirplaneCard
                    airplane={selectedFlight?.airplane}
                    isEditable={false}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-1 mb">
                  Select a flight to display airplane data.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BookFlightModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        flight={selectedFlight}
        date={date}
        seatCount={count}
        fetchPassengerFlights={fetchPassengerFlights}
      />
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import FlightsList from "./FlightsList";
import {
  formatDate,
  formatDateToddMonthYYYY,
  modalType,
} from "../../helper/helper";
import HorizontalCalendar from "./HorizontalCalendar";
import FlightFiltersCard from "./FlightFiltersCard";
import { getFlights } from "../../apis/flightsApi";
import PageMsgDisplay from "../../components/PageMsgDisplay";
import { formatFlightsByDate } from "../../helper/formatter";
import FlightModal from "./FlightModal/FlightModal";
import { getAvailablePlanes } from "../../apis/airplaneApi";
import { useToast } from "../../components/Toast/ToastService";
import { getAvailableCrews } from "../../apis/crewApi";
import AirplanesAvailable from "./AvailablePage/AirplanesAvailable";
import CrewAvailable from "./AvailablePage/CrewAvailable";

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [crew, setCrew] = useState([]);
  const [flightsDateData, setFlightsDateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toast = useToast();

  //Calendar Logic
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Modal Logic
  const [modalData, setModalData] = useState({
    open: false,
    type: modalType.ADD,
    data: null,
  });

  //Availabe Page Logic
  const [isAirplaneFilter, setIsAirplaneFilter] = useState(false);
  const [isCrewFilter, setIsCrewFilter] = useState(false);

  const closeModel = () => {
    setModalData({
      open: false,
      type: modalType.ADD,
      data: null,
    });
  };

  async function fetchFlights() {
    try {
      setLoading(true);
      const data = await getFlights();
      setFlights(data);
      const formattedData = formatFlightsByDate(data);
      setFlightsDateData(formattedData);
      // console.log(flightsDateData);
      // // console.log(formattedData[""].airplane.airline);
    } catch (error) {
      console.log(error);
      setError(
        "Oops! We couldn't load the flight data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailablePlanes(date) {
    try {
      const data = await getAvailablePlanes(date);
      setPlanes(data);
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error fetching available planes",
        toastType.ERROR
      );
    }
  }
  async function fetchAvailableCrew(date) {
    try {
      const data = await getAvailableCrews(date);
      setCrew(data);
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error fetching available crew",
        toastType.ERROR
      );
    }
  }

  const onAirplanesFilterClicked = () => {
    setIsCrewFilter(false);
    setIsAirplaneFilter(true);
    fetchAvailablePlanes(formatDate(selectedDate));
  };
  const onCrewFilterClicked = () => {
    setIsAirplaneFilter(false);
    setIsCrewFilter(true);
    fetchAvailableCrew(formatDate(selectedDate));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    fetchAvailablePlanes(formatDate(selectedDate));
    fetchAvailableCrew(formatDate(selectedDate));
  }, [selectedDate]);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;
  return (
    <div className="w-full h-full  flex flex-col">
      <div className="mb-2 flex gap-5 items-center">
        <div className="text-2xl font-semibold">Flights</div>
        <div className="text-xs bg-primary-light py-1 px-2 rounded-sm text-white">
          {formatDateToddMonthYYYY(new Date())}
        </div>
      </div>

      <div className=" w-full h-full  max-w-3xl mx-auto  ">
        <HorizontalCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          onAddPressed={() => {
            // fetchAvailablePlanes(formatDate(selectedDate));
            // fetchAvailableCrew(formatDate(selectedDate));
            setModalData({
              open: true,
              type: modalType.ADD,
              data: null,
            });
          }}
        />
        <div className=" mt-4 flex gap-4  ">
          <FlightFiltersCard
            isAirplaneFilter={isAirplaneFilter}
            isCrewFilter={isCrewFilter}
            onAirplanesPressed={onAirplanesFilterClicked}
            onCrewPressed={onCrewFilterClicked}
          />
          {isAirplaneFilter ? (
            <AirplanesAvailable
              planes={planes}
              onBackClicked={() => {
                setIsAirplaneFilter(false);
              }}
            />
          ) : isCrewFilter ? (
            <CrewAvailable
              crewData={crew}
              onBackClicked={() => {
                setIsCrewFilter(false);
              }}
            />
          ) : (
            <FlightsList
              selectedDate={selectedDate}
              flightsData={flightsDateData}
              fetchFlights={fetchFlights}
              onEditFlight={(flight) => {
                // fetchAvailablePlanes(formatDate(selectedDate));
                // fetchAvailableCrew(formatDate(selectedDate));
                setModalData({
                  open: true,
                  type: modalType.EDIT,
                  data: flight,
                });
              }}
            />
          )}
        </div>
      </div>
      <FlightModal
        selectedDate={selectedDate}
        modalData={modalData}
        onClose={closeModel}
        planes={planes}
        crew={crew}
        setModalData={setModalData}
        fetchFlights={fetchFlights}
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import PriceSlider from "../../components/PriceSlider/PriceSlider";
import Modal from "../../components/Modal";
import AirplaneCard from "../../components/AirplaneCard";
import {
  formatDateToddMonthYYYY,
  formatDate,
  modalType,
  flightViewModalType,
  toastType,
} from "../../helper/helper";
import FlightFiltersCard from "./FlightFiltersCard";
import FlightCard from "../../components/FlightCard";
import { useAuth } from "../../context/AuthContext";
import FlightViewModal from "./FlightViewModal";
import { deleteFlight } from "../../apis/flightsApi";
import { useToast } from "../../components/Toast/ToastService";
import { getFlightBookings } from "../../apis/bookingApi";

const FlightsList = ({
  selectedDate,
  flightsData,
  fetchFlights,
  onEditFlight,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const [flightViewModalData, setFlightViewModalData] = useState({
    open: false,
    type: flightViewModalType.AIRPLANE,
    data: null,
  });

  const isAuthority = (user) => {
    if (user && user.role) {
      return user.role === "admin";
    }
    return false;
  };
  const onAirplaneView = (schedule) => {
    if (!schedule?.airplane) return;
    setFlightViewModalData({
      open: true,
      type: flightViewModalType.AIRPLANE,
      data: schedule?.airplane,
    });
  };

  const onCrewView = (schedule) => {
    if (!schedule?.crew) return;
    setFlightViewModalData({
      open: true,
      type: flightViewModalType.CREW,
      data: schedule?.crew,
    });
  };
  const onBookingView = async (flightId) => {
    try {
      const responseData = await getFlightBookings(flightId);
      toast.open(
        responseData?.message || "Fetched Flight booking successfully",
        toastType.SUCCESS
      );
      setFlightViewModalData({
        open: true,
        type: flightViewModalType.BOOKING,
        data: responseData,
      });
    } catch (error) {
      toast.open(error, toastType.ERROR);
    }
  };
  const onDeleteFlight = async (flightId) => {
    try {
      const responseData = await deleteFlight(flightId);
      toast.open(responseData?.message, toastType.SUCCESS);
      fetchFlights();
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error deleting flight",
        toastType.ERROR
      );
    }
  };

  return (
    <div className="flex-1 space-y-2 w-full">
      <div>
        {flightsData[formatDate(selectedDate)]?.length > 0 ? (
          flightsData[formatDate(selectedDate)].map((flight, index) => (
            <div key={index}>
              <FlightCard
                flight={flight}
                isAuthority={isAuthority(user)}
                onAirplaneClicked={() => {
                  onAirplaneView(flight);
                }}
                onCrewClicked={() => {
                  onCrewView(flight);
                }}
                onDeleteClicked={() => {
                  onDeleteFlight(flight?.id);
                }}
                onEditClicked={() => {
                  onEditFlight(flight);
                }}
                onBookingClicked={() => {
                  onBookingView(flight?.id);
                }}
              />
            </div>
          ))
        ) : (
          <div className="mt-10 text-gray-800 text-center w-full mx-auto text-sm ">
            Oops! No flight schedules available at the moment. Try adjusting
            your search or add schedules.
          </div>
        )}
      </div>
      <FlightViewModal
        flightViewModalData={flightViewModalData}
        setFlightViewModalData={setFlightViewModalData}
      />
    </div>
  );
};

export default FlightsList;

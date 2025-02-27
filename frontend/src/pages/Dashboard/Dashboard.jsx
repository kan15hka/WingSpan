import React, { useEffect, useState } from "react";
import AnalyticsCard from "../../components/AnalyticsCard";
import AnalyticsPieCard from "../../components/AnalyticsPieCard";
import { formatDateToddMonthYYYY } from "../../helper/helper";
import PriceRangeSlider from "../../components/PriceSlider/PriceRangeSlider";
import { axiosInstance } from "../../apis/axiosInstance";
import PageMsgDisplay from "../../components/PageMsgDisplay";
import RevenueChart from "./RevenueChart";
import FlightsBarChart from "./FlightsBarChart";

export default function Dashboard() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashBoardData, setDashBoardData] = useState(null);
  const fetchDashBoardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get_dashboard_data");
      setDashBoardData(response.data);
    } catch (error) {
      setError(
        "Oops! We couldn't load the airplane data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;

  return (
    <div>
      <div className="mb-5 flex gap-5 items-center">
        <div className="text-2xl font-semibold">Reports and Analytics</div>
        <div className="text-xs bg-primary-light py-1 px-2 rounded-sm text-white">
          {formatDateToddMonthYYYY(new Date())}
        </div>
      </div>
      <div className="flex flex-col">
        {" "}
        <div className="w-full flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <div className="flex-1 flex mb-2 gap-2">
              <AnalyticsCard
                parameterLabel="Total Airplanes"
                parameterValue={dashBoardData?.total_airplanes}
                parameterDesc="Airplane models and brands"
              />
              <AnalyticsCard
                parameterLabel="Total Users"
                parameterValue={dashBoardData?.total_users}
                parameterDesc="No. of registered users"
              />
            </div>
            <div className="flex-1 flex gap-2">
              <AnalyticsCard
                parameterLabel="Flights Today"
                parameterValue={dashBoardData?.total_flights_today}
                parameterDesc="No. of flights scheduled"
              />
              <AnalyticsCard
                parameterLabel="Revenue Today"
                parameterValue={`$ ${dashBoardData?.revenue.today}`}
                parameterDesc="Total revenue generated"
              />
            </div>
          </div>
          <div className="flex-1">
            <RevenueChart perDayRevenueData={dashBoardData?.revenue.per_date} />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <AnalyticsPieCard
              uniqueKey="seatsBooked"
              parameterLabel="Seats Booked"
              parameterValue={`${dashBoardData?.seats.booked} / ${dashBoardData?.seats.total}`}
              parameterDesc="Total seats booked"
              labelsList={["Booked", "Empty"]}
              dataList={[
                dashBoardData?.seats.booked,
                dashBoardData?.seats.total,
              ]}
            />
            <AnalyticsPieCard
              uniqueKey="crewAvailable"
              parameterLabel="Crew Available"
              parameterValue={`${dashBoardData?.crew.available} / ${dashBoardData?.crew.total}`}
              parameterDesc="Crew members available"
              labelsList={["Assigned", "Free"]}
              dataList={[
                dashBoardData?.crew.available,
                dashBoardData?.crew.total,
              ]}
            />
          </div>
          <div className="flex-1">
            <FlightsBarChart
              perDayFlightSchedules={dashBoardData?.flights_per_date}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

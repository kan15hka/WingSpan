import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Function to generate last 7 days
const generateLast7Days = () => {
  const today = new Date();
  let dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // Format to 'yyyy-mm-dd'
  }
  return dates;
};

const FlightsBarChart = ({ perDayFlightSchedules = {} }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dates = generateLast7Days();
    const formattedData = dates.map((date) => {
      const revenueData = perDayFlightSchedules[date] || 0; // If no revenue for the day, set it to 0
      return { date, revenue: revenueData };
    });
    setData(formattedData);
  }, [perDayFlightSchedules]);

  return (
    <div className="w-full p-3 bg-white border rounded-md">
      <h2 className="text font-semibold mb-4">
        Flights schedules over last 7 Days
      </h2>
      <ResponsiveContainer width="100%" height={165}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip contentStyle={{ fontSize: "0.875rem" }} />
          <Bar dataKey="revenue" fill="#0f457a" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlightsBarChart;

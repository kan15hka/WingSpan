import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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

const RevenueChart = ({ perDayRevenueData = {} }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dates = generateLast7Days();
    const formattedData = dates.map((date) => {
      const revenueData = perDayRevenueData[date] || 0; // If no revenue for the day, set it to 0
      return { date, revenue: revenueData };
    });
    setData(formattedData);
  }, [perDayRevenueData]);

  return (
    <div className="w-full p-3 bg-white border rounded-md">
      <h2 className="text font-semibold mb-4">Revenue Over the Last 7 Days</h2>
      <ResponsiveContainer width="100%" height={165}>
        <AreaChart
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
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0f457a"
            strokeWidth={2}
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f457a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0f457a" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

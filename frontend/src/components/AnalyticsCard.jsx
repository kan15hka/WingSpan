import React from "react";

export default function AnalyticsCard({
  parameterLabel,
  parameterValue,
  parameterDesc,
}) {
  return (
    <div className="flex-1 bg-white border h-28 rounded-md p-3 flex flex-col justify-between">
      <div className="font-semibold">{parameterLabel}</div>
      <div className="text-3xl font-bold">{parameterValue}</div>
      <div className="text-xs text-gray-500">{parameterDesc}</div>
    </div>
  );
}

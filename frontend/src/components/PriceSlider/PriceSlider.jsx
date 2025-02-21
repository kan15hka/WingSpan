import React, { useState } from "react";

const PriceSlider = ({ minVal, maxVal, price, setPrice }) => {
  return (
    <div className="py-2">
      <div className="font-semibold text-gray-700">1.5 hrs - {price} hrs</div>

      <input
        type="range"
        min={minVal}
        max={maxVal}
        step={0.5}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className=" w-full h-[3px] bg-gray-300  appearance-none cursor-pointer accent-primary-light "
      />
    </div>
  );
};

export default PriceSlider;

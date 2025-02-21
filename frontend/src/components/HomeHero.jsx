import React, { useState } from "react";

import UserAuthCard from "../pages/Passenger/Components/UserAuthCard";

export default function HomeHero({ onProfileClicked }) {
  const navList = ["Home", "About", "Offers", "Seats", "Destinations"];

  return (
    <div>
      <div className="relative flex items-center justify-between ">
        <div className="flex items-center gap-2 mr-2">
          <img
            src="src/assets/logo.png"
            alt=""
            className="h-10 w-10 object-contain"
          />
          <div className="text-lg  font-semibold">WingSpan</div>
        </div>
        <div className="hidden md:flex gap-5">
          {navList.map((navItem) => {
            return (
              <div
                key={navItem}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {navItem}
              </div>
            );
          })}
        </div>
        <UserAuthCard onProfileClicked={onProfileClicked} />
      </div>
      <div className="mt-8 text-xl md:text-2xl lg:text-3xl font-semibold text-center ">
        Find and Fly Your Next
        <br />
        Great Adventure!
      </div>
      <div className="w-full  ">
        <img
          src="src/assets/header.jpg"
          alt=""
          className="h-40 md:h-48 lg:h-64 object-contain over mx-auto"
        />
      </div>
    </div>
  );
}

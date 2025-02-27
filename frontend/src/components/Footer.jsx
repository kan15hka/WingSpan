import React from "react";

export default function Footer() {
  const navList = ["Home", "About", "Offers", "Seats", "Destinations"];

  return (
    <div className="h-48 w-full bg-primary-light px-12 py-10 flex flex-col justify-between">
      <div className="  relative flex items-center justify-between ">
        <div className="flex items-center gap-2 ">
          <img
            src="/images/logo.webp"
            alt=""
            className="h-10 w-10 object-contain"
          />
          <div className="text-lg text-white font-semibold">WingSpan</div>
        </div>
        <div className="hidden md:flex gap-5">
          {navList.map((navItem) => {
            return (
              <div
                key={navItem}
                className=" text-white hover:text-primary cursor-pointer"
              >
                {navItem}
              </div>
            );
          })}
        </div>{" "}
        <div className=" font-semibold bg-primary-light rounded-md hover:bg-primary text-white py-2 px-3  cursor-pointer">
          Contact Us
        </div>
      </div>
      <div className="border-t text-white border-white text-center pt-3 mt-8">
        <div className="text-sm">&copy; All rights reserved.</div>
      </div>
    </div>
  );
}

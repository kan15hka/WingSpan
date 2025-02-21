import React, { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaPeopleGroup, FaUsers } from "react-icons/fa6";
import { MdFlight, MdScheduleSend } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import CrewsPage from "../../pages/Crew/CrewsPage";
import AirplanesPage from "../../pages/Aiplanes/AirplanesPage";
import FlightsPage from "../../pages/Flights/FlightsPage";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AuthorityPage from "../../pages/Authority/AuthorityPage";
import { RiAdminFill } from "react-icons/ri";
import UsersPage from "../../pages/Users/UsersPage";
const sidebarItems = [
  {
    id: 1,
    icon: <AiFillHome size={22} />,
    label: "Home",
    component: <Dashboard />,
  },
  {
    id: 2,
    icon: <MdFlight size={22} />,
    label: "Planes",
    component: <AirplanesPage />,
  },
  {
    id: 3,
    icon: <MdScheduleSend size={22} />,
    label: "Flights",
    component: <FlightsPage />,
  },
  {
    id: 4,
    icon: <FaPeopleGroup size={22} />,
    label: "Crew",
    component: <CrewsPage />,
  },
  {
    id: 5,
    icon: <RiAdminFill size={22} />,
    label: "Authority",
    component: <AuthorityPage />,
  },
  {
    id: 6,
    icon: <FaUsers size={22} />,
    label: "Users",
    component: <UsersPage />,
  },
];

export default function SideBar({
  open,
  setOpen,
  selectedIndex,
  setSelectedIndex,
  setSelectedPage,
}) {
  return (
    <div
      className={`flex flex-col bg-primary rounded-md duration-300 ${
        open ? "w-52 px-4" : "w-16 items-center"
      }`}
    >
      {/* Profile Section */}
      <div className="my-4 flex gap-2 items-center">
        <div className="h-10 w-10 flex items-center justify-center  rounded-md">
          <img src="src/assets/logo.png" alt="logoImg" />{" "}
        </div>
        <div
          className={`text-white text-lg font-semibold duration-300 ${
            !open && "hidden"
          }`}
        >
          WingSpan{" "}
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="mb-auto">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedIndex(item.id);
              setSelectedPage(item.component);
            }}
            className={`my-3 p-2 rounded-md flex gap-3 text-sm items-center duration-300 ${
              selectedIndex === item.id && "bg-primary-light"
            }`}
          >
            <div className="text-white">{item.icon}</div>
            <div className={`text-white duration-300 ${!open && "hidden"}`}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <div
        onClick={() => setOpen(!open)}
        className={`text-white border-t-2 h-16 border-slate-500 w-full flex gap-3 items-center duration-300 ${
          !open && "justify-center"
        }`}
      >
        <TbLogout2 size={22} />
        <div className={`text-sm duration-300 ${!open && "hidden"}`}>Close</div>
      </div>
    </div>
  );
}

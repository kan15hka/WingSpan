import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";

export default function AuthorityUserCard({
  user,
  open,
  setOpen,
  isLoggingOut,
  onAuthoritySignOut,
  openModal,
  setOpenModal,
  setShowProfileModal,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div
        className={`absolute   right-8 top-4 flex items-center rounded-md duration-300 ${
          open ? "bg-white border p-1 " : " p-0"
        }`}
      >
        <div className="flex items-center gap-2 ">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="h-10 w-10 flex items-center justify-center bg-primary text-white font-semibold rounded-md"
          >
            {user?.username?.substring(0, 2).toUpperCase() || "NA"}
          </div>
          <div
            className={`text-black flex items-center gap-2 duration-300 ${
              !open && "hidden"
            }`}
          >
            <div className="flex-col  justify-between">
              <div className="text-sm font-semibold">{user?.username}</div>
              <div className="text-sm text-gray-600 capitalize">
                {user?.role}
              </div>
            </div>
            <div
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
              className={`border  px-2 py-2 rounded-md ${
                openMenu
                  ? "bg-primary-light text-white"
                  : "bg-white hover:bg-cutomGrey-light"
              }`}
            >
              <HiDotsHorizontal size={15} />
            </div>
          </div>{" "}
          {openMenu && (
            <div className="absolute w-32  cursor-pointer top-12 right-0 bg-white text-gray-600 hover:text-gray-700 border rounded-md flex flex-col">
              <div className="capitalize text-black font-medium p-2 border-b">
                {user.role === "user" ? "passenger" : user.role}
              </div>

              <div
                onClick={() => {
                  setShowProfileModal(true);
                  setOpenMenu(false);
                }}
                className="flex p-2 border-b gap-2 items-center  hover:bg-gray-200"
              >
                <div>
                  <FaRegUser size={18} />
                </div>
                <div className="text-sm">Profile</div>
              </div>

              <div
                onClick={() => {
                  setOpenModal(true);
                }}
                className="flex p-2 gap-2 items-center  hover:bg-gray-200 rounded-b-md"
              >
                <div>
                  <TbLogout2 size={18} />
                </div>
                <div className="text-sm">
                  {isLoggingOut ? "Logging Out" : "Logout"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <div className="w-72">
          <div className="text-sm uppercase font-semibold">Confirm Logout</div>
          <div className="text-gray-500">Are you sure want to logout?</div>
          <div className="mt-3 flex gap-2">
            <div
              onClick={() => {
                setOpenModal(false);
              }}
              className="flex-1 flex items-center justify-center bg-primary-light hover:bg-primary p-2 rounded-md text-white font-semibold"
            >
              Cancel
            </div>
            <div
              onClick={onAuthoritySignOut}
              className="flex-1 flex items-center justify-center bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-black font-semibold"
            >
              Yes
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

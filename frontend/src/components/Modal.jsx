import React from "react";
import { MdClose } from "react-icons/md";

export default function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/40" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-md shadow p-4 transition-all ${
          open ? "scale-100 opacity-100 " : "scale-125 opacity-0"
        }`}
      >
        <div
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 p-1 rounded-full hover:bg-black hover:text-white duration-300"
        >
          <MdClose />
        </div>
        {children}
      </div>
    </div>
  );
}

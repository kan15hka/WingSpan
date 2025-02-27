import React from "react";
import { toastType } from "../../helper/helper";
import { SiTicktick } from "react-icons/si";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaRegMessage } from "react-icons/fa6";

export default function Toast({ message, type }) {
  return (
    <div
      className={`w-64 p-2 flex gap-2 rounded-md items-center ${
        type === toastType.SUCCESS
          ? "bg-toastColor-successBg"
          : type === toastType.ERROR
          ? "bg-toastColor-errorBg"
          : "bg-toastColor-normalBg"
      }`}
    >
      <div
        className={` ${
          type === toastType.SUCCESS
            ? "text-toastColor-success"
            : type === toastType.ERROR
            ? "text-toastColor-error"
            : "text-toastColor-normal"
        }`}
      >
        {type === toastType.SUCCESS ? (
          <SiTicktick size={22} />
        ) : type === toastType.ERROR ? (
          <RiCloseCircleLine size={22} />
        ) : (
          <FaRegMessage size={22} />
        )}
      </div>
      <div>
        <div
          className={`text-sm font-semibold ${
            type === toastType.SUCCESS
              ? "text-toastColor-success"
              : type === toastType.ERROR
              ? "text-toastColor-error"
              : "text-toastColor-normal"
          }`}
        >
          {type === toastType.SUCCESS
            ? "SUCCESS"
            : type === toastType.ERROR
            ? "ERROR"
            : "NORMAL"}
        </div>
        <div
          className={`text-sm ${
            type === toastType.SUCCESS
              ? "text-toastColor-success"
              : type === toastType.ERROR
              ? "text-toastColor-error"
              : "text-toastColor-normal"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

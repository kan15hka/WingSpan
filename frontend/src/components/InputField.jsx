import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function InputField({
  isPasswordField,
  value,
  setValue,
  placeholder,
  label,
}) {
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  return (
    <div className="my-3 flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 capitalize">
        {label}
      </label>
      <input
        type={!isPasswordField ? "text" : "password"}
        className="input-box w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(target) => {
          if (target.key == "Enter") {
          }
        }}
      />
    </div>
  );
}

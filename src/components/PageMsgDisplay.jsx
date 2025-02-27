import React from "react";

export default function PageMsgDisplay({ text }) {
  return (
    <div className="mt-1/2 bg-primary-light h-screen w-full flex flex-col gap-2 items-center justify-center">
      {/* <img
              src="src/assets/error.jpg"
              alt="ErrorImg"
              className="w-1/3 h-auto rounded-md"
            /> */}
      <div className="text-sm w-1/2 text-center text-white"> {text}</div>
    </div>
  );
}

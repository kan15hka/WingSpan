import React from "react";

export default function PageMsgDisplay({ text }) {
  return (
    <div className="h-full w-full flex flex-col gap-2 items-center justify-center">
      <div className="text-sm w-1/2 text-center"> {text}</div>
    </div>
  );
}

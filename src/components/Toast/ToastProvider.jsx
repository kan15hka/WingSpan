import React, { useState } from "react";
import ToastContext from "./ToastService";
import { MdClose } from "react-icons/md";
import Toast from "./Toast";

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const open = (message, toastType, timeout = 5000) => {
    const id = Date.now();
    setToasts((toasts) => [
      ...toasts,
      { id, component: <Toast message={message} type={toastType} /> },
    ]);

    setTimeout(() => close(id), timeout);
  };

  const close = (id) =>
    setToasts((toasts) => toasts.filter((toast) => toast.id != id));

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      <div className="space-y-2 absolute top-4 right-4">
        {toasts.map(({ id, component }) => (
          <div key={id} className="relative">
            <button
              onClick={() => close(id)}
              className="absolute top-1 right-1 p-1 rounded-full bg-white/55 text-primary-light"
            >
              <MdClose size={15} />
            </button>
            {component}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

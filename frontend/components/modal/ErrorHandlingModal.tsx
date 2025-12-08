"use client";
import { useEffect, useState } from "react";
import useStatusMessage from "@/components/global_hook/ErrorHandling";

const ErrorHandlingModal = () => {
  const message = useStatusMessage((state) => state.message);

  useEffect(() => {
    if (!message) return; // exit if no message

    const timer = setTimeout(() => {
      useStatusMessage.getState().setMessage(""); // clear message after 3s
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded shadow">{message}</div>;
};

export default ErrorHandlingModal;

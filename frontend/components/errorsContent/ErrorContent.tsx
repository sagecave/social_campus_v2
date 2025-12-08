"use client";
import { useState, useEffect } from "react";
type contentData = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};
const ErrorContent = ({ errorMessage, setErrorMessage }: contentData) => {
  useEffect(() => {
    setErrorMessage(errorMessage);
  }, [errorMessage]);
  return (
    <div className=" animate-bounce absolute left-1/2 top-4  -translate-x-1/2  z-10 bg-inside-border-white border border-border-grey rounded-xl px-6  ">
      <h2 className=" p-4 text-[1.2rem] font-semibold text-accent-purple">{errorMessage}</h2>
    </div>
  );
};

export default ErrorContent;

"use client";
import { useState, useEffect } from "react";
import ErrorContent from "@/components/errorsContent/ErrorContent";
type contentData = {
  errorMessage: string;
};
type modalData = {
  errorMessageGet: string;
  setErrorMessageGet: React.Dispatch<React.SetStateAction<string>>;
};

const ErrorHandlingModal = ({ errorMessageGet, setErrorMessageGet }: modalData) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalErrorOpen, setModalErrorOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!errorMessageGet) return;
    if (errorMessageGet.length > 0) {
      const timer = setTimeout(() => {
        setModalErrorOpen(true);

        const timerClose = setTimeout(() => {
          setModalErrorOpen(false);
          setErrorMessageGet("");
        }, 5000);
        return () => clearTimeout(timerClose);
      }, 0);
      return () => clearTimeout(timer);
    }
    if (errorMessage.length < 0) {
      const timerClose = setTimeout(() => {
        setModalErrorOpen(false);
        setErrorMessageGet("");
      }, 0);
    }
  }, [errorMessageGet]);

  return <>{modalErrorOpen ? <ErrorContent setErrorMessage={setErrorMessage} errorMessage={errorMessageGet} /> : <></>}</>;
};

export default ErrorHandlingModal;

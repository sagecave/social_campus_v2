import { create } from "zustand";

interface StatusMessageState {
  message: string;
  setMessage: (newMessage: string) => void;
}

const useStatusMessage = create<StatusMessageState>((set) => ({
  message: "",
  setMessage: (newMessage) => set({ message: newMessage }),
}));

export default useStatusMessage;

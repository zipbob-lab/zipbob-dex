import { create } from "zustand";

interface DropboxState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useDropboxStore = create<DropboxState>((set) => ({
  isOpen: false,
  setIsOpen: (open: boolean) => set({ isOpen: open })
}));

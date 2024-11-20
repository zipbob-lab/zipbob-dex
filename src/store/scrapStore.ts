import { create } from "zustand";

interface ScrapStore {
  userId: string | null;
  setUserId: (id: string | null) => void;
  folderName: string;
  setFolderName: (folder: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  existingFolders: string[];
  setExistingFolders: (folders: string[]) => void;
  selectedFolder: string | null | undefined;
  setSelectedFolder: (folder: string | null | undefined) => void;
}

export const useScrapStore = create<ScrapStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  folderName: "",
  setFolderName: (folder) => set({ folderName: folder }),
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  existingFolders: [],
  setExistingFolders: (folders) => set({ existingFolders: folders }),
  selectedFolder: undefined,
  setSelectedFolder: (folder: string | null | undefined) => set({ selectedFolder: folder })
}));

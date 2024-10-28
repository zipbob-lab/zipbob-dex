import { create } from "zustand";

type ScrapStore = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  folderName: string;
  setFolderName: (folder: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  existingFolders: string[];
  setExistingFolders: (folders: string[]) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
};

export const useScrapStore = create<ScrapStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  folderName: "",
  setFolderName: (folder) => set({ folderName: folder }),
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  existingFolders: [],
  setExistingFolders: (folders) => set({ existingFolders: folders }),
  selectedFolder: null, // 초기값을 null로 설정
  setSelectedFolder: (folder) => set({ selectedFolder: folder })
}));

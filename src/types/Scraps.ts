import { UseQueryResult } from "@tanstack/react-query";

export interface ScrapModalProps {
  isSaving: boolean;
  folderName: string;
  existingFolders: string[];
  onFolderNameChange: (folder: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  onFolderClick: (folder: string) => void;
}

// useScrapData 에서 사용하는 type
export interface Scrap {
  scrap_id: string;
  folder_name: string;
  scraped_recipe: string;
  created_at: string;
  updated_at: string;
}

export interface UseScrapData {
  existingFolders: string[] | undefined;
  scraps: Scrap[] | undefined;
  refetchFolders: () => void;
  refetchScraps: () => void;
  incrementScrapCount: (recipeId: string) => Promise<boolean>;
  saveScrap: (params: { recipeId: string; folderName: string }) => Promise<boolean>;
  deleteScrap: (recipeId: string) => Promise<boolean>;
  isAlreadyScrapped: (recipeId: string) => Promise<boolean>;
  useFetchScrapCount: (recipeId: string) => UseQueryResult<number>;
  page: number;
  handlePageChange: (newPage: number) => void;
  totalScraps: number;
}

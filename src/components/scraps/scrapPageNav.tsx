import React from "react";

interface ScrapPageNavProps {
  selectedFolder: string;
  folderScrapCounts: Record<string, number>;
  existingFolders: string[];
  handleFolderClick: (folder: string) => void;
  toggleEditMode: () => void;
  isEditMode: boolean;
}

const ScrapPageNav: React.FC<ScrapPageNavProps> = ({
  selectedFolder,
  folderScrapCounts,
  existingFolders,
  handleFolderClick,
  toggleEditMode,
  isEditMode
}) => {
  return (
    <div className="flex items-center justify-between border-b-[1px] pt-2">
      <nav
        className="flex w-full overflow-x-auto whitespace-nowrap ssm:text-title-13 sm:text-title-14 [&::-webkit-scrollbar]:hidden"
        style={{
          maxWidth: "90%"
        }}
      >
        <button
          onClick={() => handleFolderClick("전체")}
          className={`relative flex flex-row items-center justify-center whitespace-nowrap px-2 pb-1 ssm:text-title-13 sm:text-title-14 md:text-title-16 ${
            selectedFolder === "전체" ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
          }`}
        >
          전체
          <span
            className={`ml-2 flex items-center justify-center rounded-full ssm:h-5 ssm:w-5 ssm:text-body-13 md:h-6 md:w-6 md:text-body-16 ${
              selectedFolder === "전체" ? "bg-Primary-200 text-white" : "bg-Gray-500 text-white"
            }`}
          >
            {folderScrapCounts["전체"] || 0}
          </span>
        </button>
        {existingFolders?.map((folder) => (
          <button
            key={folder}
            onClick={() => handleFolderClick(folder)}
            className={`relative flex flex-row items-center justify-center whitespace-nowrap px-2 pb-1 ssm:text-title-13 sm:text-title-14 md:text-title-16 ${
              selectedFolder === folder ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
            }`}
          >
            {folder}
            <span
              className={`ml-2 flex items-center justify-center rounded-full ssm:h-5 ssm:w-5 ssm:text-body-13 md:h-6 md:w-6 md:text-body-16 ${
                selectedFolder === folder ? "bg-Primary-200 text-white" : "bg-Gray-500 text-white"
              }`}
            >
              {folderScrapCounts[folder] || 0}
            </span>
          </button>
        ))}
      </nav>
      <button
        onClick={toggleEditMode}
        className={`ml-auto pb-1 ssm:text-title-13 sm:text-title-14 md:text-title-16 ${
          isEditMode ? "text-body-16 text-Primary-300" : "text-Gray-500"
        }`}
      >
        편집
      </button>
    </div>
  );
};

export default ScrapPageNav;

"use client";
import Image from "next/image";
import DefaultImage from "@images/default-profile.svg";
import { useState, useRef, useEffect } from "react";

interface ProfileImageUploadProps {
  userId: string;
  initialImageUrl: string;
  onImageUpload: (file: File | null) => void;
}
const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, initialImageUrl, onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // userId가 사용되지 않음을 ESLint에 알림
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _userId = userId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      onImageUpload(file);
    }
  };

  useEffect(() => {
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-[120px] w-[120px]">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      <Image
        src={previewUrl || DefaultImage}
        alt="프로필 미리보기"
        width={120}
        height={120}
        onClick={handleImageClick}
        className="h-full w-full cursor-pointer rounded-full object-cover"
      />
    </div>
  );
};

export default ProfileImageUpload;

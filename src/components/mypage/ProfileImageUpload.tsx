"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface ProfileImageUploadProps {
  userId: string;
  initialImageUrl: string;
  onImageUpload: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, initialImageUrl, onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      <Image
        src={previewUrl || "/default-profile.png"}
        alt="프로필 미리보기"
        width={120}
        height={120}
        onClick={handleImageClick}
        className="w-40 h-40 rounded-full mt-4 object-cover cursor-pointer"
      />
    </div>
  );
};

export default ProfileImageUpload;

"use client";
import { useState } from "react";

interface ProfileImageUploadProps {
  userId: string;
  onImageUpload: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      onImageUpload(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Image Preview" className="w-40 h-40 rounded-full mt-4 object-cover" />}
    </div>
  );
};

export default ProfileImageUpload;

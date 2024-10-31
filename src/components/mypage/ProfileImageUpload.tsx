// import { supabase } from "@/supabase/supabase";
// import { CircleCheckBig } from "lucide-react";

interface ProfileImageUploadProps {
  userId: string;
  onImageUpload: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, onImageUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onImageUpload(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ProfileImageUpload;

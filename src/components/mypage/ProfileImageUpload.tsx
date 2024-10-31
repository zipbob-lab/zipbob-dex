import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/supabase/supabase";
import { CircleCheckBig } from "lucide-react";

const profileSchema = z.object({
  profileImage: z
    .any()
    .refine((file) => file instanceof File && file.size <= 5 * 1024 * 1024, {
      message: "5MB 이하의 파일만 가능합니다."
    })
    .refine((file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type), {
      message: "JPEG, PNG, GIF 이미지 파일만 가능합니다."
    })
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileImageUploadProps {
  userId: string;
  onImageUpload: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, onImageUpload }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  // 이미지 업로드 함수
  const onSubmit = async (data: ProfileFormData) => {
    console.log("onSubmit 할 때 data:", data);
    console.log("userId 확인", userId);
    const file = data.profileImage;
    if (!file) {
      console.log("파일이 없습니다.");
      return;
    }
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("zipbob_storage")
      .upload(`userProfileFolder/${userId}`, file, { upsert: true });

    if (uploadError) {
      console.error("사진 업로드 오류", uploadError.message);
      return;
    }

    const profileImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/userProfileFolder/${userId}`;
    console.log("이미지 업로드 성공:", profileImageUrl);
    const { error: updateError } = await supabase
      .from("USER_TABLE")
      .update({ user_img: profileImageUrl })
      .eq("user_id", userId);

    if (updateError) {
      console.log("USER_TABLE 업데이트 오류 발생", updateError.message);
      return;
    }
    onImageUpload(profileImageUrl);
    console.log("USER_TABLE 업데이트 성공!", profileImageUrl);
    alert("프로필사진이 변경되었습니다.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        {...(register("profileImage"), { required: true })}
        onChange={(e) => {
          const file = e.target.files?.[0];
          console.log("File selected:", file);
          if (file) {
            setValue("profileImage", file, { shouldValidate: true });
          }
        }}
      />
      {errors.profileImage && <p className="text-red-500 text-sm mt-1">{String(errors.profileImage.message)}</p>}
      <button type="submit" className="flex gap-2 align-middle">
        이미지 수정
        <CircleCheckBig size={16} className="hover:text-green-500 mt-1" />
      </button>
    </form>
  );
};

export default ProfileImageUpload;

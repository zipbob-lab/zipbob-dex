// ProfileImageUpload.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/supabase/supabase";

const profileSchema = z.object({
  profileImage: z
    .any()
    .refine((file) => file instanceof File && file.size <= 10 * 1024 * 1024, {
      message: "10MB 이하의 파일만 가능합니다."
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

    const profileImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/userProfileFolder4/${userId}`;
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
            setValue("profileImage", file, { shouldValidate: true }); // 파일을 필드에 설정 및 유효성 검사
          }
        }}
      />
      {errors.profileImage && <p className="text-red-500 text-sm mt-1">{errors.profileImage.message}</p>}

      <button type="submit" className="mt-3 p-2 bg-blue-500 text-white rounded-sm">
        이미지 수정
      </button>
    </form>
  );
};

export default ProfileImageUpload;

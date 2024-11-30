import { UseFormRegister, FieldValues, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface SignUpProps {
  signUpEmail: string;
  signUpPassword: string;
}

interface AccountFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserInfoFormValues {
  profileImage: string;
  nickname: string;
  introduce: string;
}

export interface AccountSetProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<AccountFormValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export interface UserInfoSetProps {
  ACCEPTED_IMAGE_TYPES: string[];
  previewImage: string | null | ArrayBuffer;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<UserInfoFormValues>;
  isProfileSet: boolean;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null | ArrayBuffer>>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export interface InputFieldProps {
  register: UseFormRegister<FieldValues>;
  label: string;
  name: string;
  placeholder: string;
  type: string;
  errors: FieldErrors;
  isEmpty: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

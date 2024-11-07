import { UseFormRegister, FieldValues, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type SignUpProps = {
  signUpEmail: string;
  signUpPassword: string;
};

type AccountFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type UserInfoFormValues = {
  profileImage: string;
  nickname: string;
  introduce: string;
};

export type AccountSetProps = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<AccountFormValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export type UserInfoSetProps = {
  ACCEPTED_IMAGE_TYPES: string[];
  previewImage: string | null | ArrayBuffer;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<UserInfoFormValues>;
  isProfileSet: boolean;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null | ArrayBuffer>>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export type InputFieldProps = {
  register: UseFormRegister<FieldValues>;
  label: string;
  name: string;
  placeholder: string;
  type: string;
  errors: FieldErrors;
  isEmpty: boolean;
  setValue: UseFormSetValue<FieldValues>;
};

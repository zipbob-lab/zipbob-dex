import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

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
};

export type UserInfoSetProps = {
  ACCEPTED_IMAGE_TYPES: string[];
  previewImage: string | null | ArrayBuffer;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<UserInfoFormValues>;
};

export type InputFieldProps = {
  register: UseFormRegister<FieldValues>;
  label: string;
  name: string;
  placeholder: string;
  type: string;
  errors: FieldErrors;
};

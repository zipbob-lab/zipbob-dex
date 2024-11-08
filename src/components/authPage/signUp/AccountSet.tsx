import { AccountSetProps } from "@/types/Auth";
import InputField from "../InputField";

const AccountSet = ({ register, errors, watch, setValue }: AccountSetProps) => {
  return (
    <>
      <h1 className="text-center text-[1.75rem] font-bold tracking-[-0.5px] text-Gray-900">회원가입</h1>
      <InputField
        register={register}
        label="이메일"
        name="email"
        placeholder="abc@email.com"
        type="email"
        errors={errors}
        isEmpty={!watch("email")}
        setValue={setValue}
      />
      <InputField
        register={register}
        label="비밀번호"
        name="password"
        placeholder="영문, 숫자 포함 8자 이상"
        type="password"
        errors={errors}
        isEmpty={!watch("password")}
        setValue={setValue}
      />
      <InputField
        register={register}
        label="비밀번호 확인"
        name="confirmPassword"
        placeholder="영문, 숫자 포함 8자 이상"
        type="password"
        errors={errors}
        isEmpty={!watch("confirmPassword")}
        setValue={setValue}
      />
    </>
  );
};

export default AccountSet;

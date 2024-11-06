import { InputFieldProps } from "@/types/auth";
import DeleteInput from "@images/deleteInput.svg";
import Image from "next/image";

const InputField = ({ register, label, name, placeholder, type, errors, isEmpty, setValue }: InputFieldProps) => {
  return (
    <div className="mt-5 flex flex-col">
      <label
        htmlFor={name}
        className={`pl-1 text-[0.875rem] text-title-14 ${errors[name] ? "text-SystemColor-Red" : "text-Gray-900"}`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`mt-2 w-full rounded-xl border ${errors[name] ? "border-SystemColor-Red" : "border-Gray-100"} py-3 pl-4 pr-10 text-body-16 text-Gray-500`}
        />
        {!isEmpty && (
          <Image
            src={DeleteInput}
            alt="input 값 삭제"
            className="absolute right-4 top-5 cursor-pointer"
            onClick={() => setValue(name, "")}
          />
        )}
      </div>
      <div className="mt-1 h-3">
        {errors[name] && <p className="text-SystemColor-Red pl-1 text-body-12">{errors[name].message?.toString()}</p>}
      </div>
    </div>
  );
};

export default InputField;

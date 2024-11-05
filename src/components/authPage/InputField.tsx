import { InputFieldProps } from "@/types/auth";

const InputField = ({ register, label, name, placeholder, type, errors }: InputFieldProps) => {
  return (
    <div className="mt-5 flex flex-col">
      <label
        htmlFor={name}
        className={`pl-1 text-[0.875rem] text-title-14 ${errors[name] ? "text-SystemColor-Red" : "text-Gray-900"}`}
      >
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`mt-2 rounded-xl border ${errors[name] ? "border-SystemColor-Red" : "border-Gray-100"} px-4 py-3 text-body-16 text-Gray-500`}
      />
      <div className="mt-1 h-3">
        {errors[name] && <p className="text-SystemColor-Red pl-1 text-body-12">{errors[name].message?.toString()}</p>}
      </div>
    </div>
  );
};

export default InputField;

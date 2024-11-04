import { InputFieldProps } from "@/types/auth";

const InputField = ({ register, label, name, placeholder, type, errors }: InputFieldProps) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="rounded-md border border-gray-500 p-2"
      />
      {errors[name] && <p className="text-red-500">{errors[name].message?.toString()}</p>}
    </div>
  );
};

export default InputField;

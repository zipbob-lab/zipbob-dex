import { InputFieldProps } from "@/types/auth";

const InputField = ({ register, label, name, placeholder, type, errors }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="border border-gray-500 rounded-md p-2"
      />
      {errors[name] && <p className="text-red-500">{errors[name].message?.toString()}</p>}
    </div>
  );
};

export default InputField;

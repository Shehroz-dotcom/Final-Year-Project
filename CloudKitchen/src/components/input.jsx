import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
  errors,
  required = false,
  minLength,
  className = "",
  ...rest
}) => {
  const error = errors?.[name];

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium text-white mb-1"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 outline-none text-white placeholder-white/70
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-white/50 focus:ring-2 focus:ring-green-500"
          }
          transition`}
        {...(register && register(name, { required, minLength }))}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error.message || (required && `${label || name} is required`)}
        </p>
      )}
    </div>
  );
};

export default Input;

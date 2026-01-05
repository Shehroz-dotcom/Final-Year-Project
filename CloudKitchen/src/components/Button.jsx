import React from "react";

const Button = ({
  children,
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full rounded-md bg-green-600 hover:bg-green-700 py-2 text-white font-medium transition 
                  disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
      {...rest} // allows onClick, style, etc.
    >
      {children}
    </button>
  );
};

export default Button;

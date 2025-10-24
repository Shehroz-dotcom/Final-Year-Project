import React from "react";

const Button = ({ children, className, variant = "green"  ,type = "button" ,  ...props }) => {
  const variants = {
    green: "before:from-[#009b49] before:to-[rgb(105,184,141)] hover:text-black",
    red: "before:from-[#ff0000] before:to-[#ff6b6b] hover:text-black",
    black: "before:from-[#000000] before:to-[#434343] hover:text-white",
  };

  return (
    <button
      type={type}
      {...props}
      className={`w-[150px] h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
        relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
        hover:scale-105 hover:shadow-lg
        text-white
        before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full 
        before:bg-gradient-to-r
        before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl 
        hover:before:left-0 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

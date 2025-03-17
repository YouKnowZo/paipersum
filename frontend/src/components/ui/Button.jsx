import React from "react";

const Button = ({ children, variant = "primary", onClick, className = "" }) => {
  const baseStyle = "px-4 py-2 font-semibold rounded-md transition-all";
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-gray-200 text-dark hover:bg-gray-300",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;

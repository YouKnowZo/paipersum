import React from "react";

const Card = ({ title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Card;

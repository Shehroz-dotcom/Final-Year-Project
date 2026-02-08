import { memo } from "react";
import React from "react";

const NutrientsCard = ({ label, value, unit, color, icon }) => {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg text-white ${color}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-extrabold">
          {icon} {label}
        </span>
        <span className="text-3xl font-extrabold">
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
};

export default memo(NutrientsCard);

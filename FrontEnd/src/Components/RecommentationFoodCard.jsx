import { memo } from 'react';
import {useNavigate } from "react-router-dom"
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

const RecommentationFoodCard = ({ name, calories, protein, image , id}) => {
  const navigate = useNavigate()
  return (
    <div
      className="
        min-w-[160px] sm:min-w-[180px] md:min-w-[200px]
        transparent  rounded-xl shadow-lg
        p-3 sm:p-4
        flex-shrink-0 cursor-pointer
        transform transition-transform duration-300 ease-out
        hover:scale-105  bg-black/70
      "
      onClick={()=> navigate(`/food/${id}`)}
    >
      <img
        src={image}
        alt={name}
        className="
          w-full h-24 sm:h-28 md:h-32
          object-cover rounded-md mb-2
        "
      />

      <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">
        {name}
      </h3>

      <p className="text-gray-300 text-xs sm:text-sm">
        {calories} kcal | {protein}g protein
      </p>
    </div>
  );
};

export default memo(RecommentationFoodCard);

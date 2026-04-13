import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const RecommentationFoodCard = ({ name, calories, protein, image, id }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full
        bg-black/70 rounded-xl shadow-lg
        p-2 sm:p-3
        cursor-pointer
        transform transition-transform duration-300 ease-out
        hover:scale-105
      "
      onClick={() => navigate(`/food/${id}`)}
    >
      <div className="w-full aspect-[4/3] overflow-hidden rounded-md mb-2">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base truncate">
        {name}
      </h3>

      <p className="text-gray-300 text-[10px] sm:text-xs md:text-sm">
        {calories} kcal | {protein}g protein
      </p>
    </div>
  );
};

export default memo(RecommentationFoodCard);

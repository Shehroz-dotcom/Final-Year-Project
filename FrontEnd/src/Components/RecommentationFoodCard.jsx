import { memo } from 'react';

const RecommentationFoodCard = ({ name, calories, protein, image }) => {
  return (
    <div className="min-w-[200px] bg-gray-800 rounded-xl shadow-lg p-4 flex-shrink-0 cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="text-white font-semibold text-lg">{name}</h3>
      <p className="text-gray-300 text-sm">
        {calories} kcal | {protein}g protein
      </p>
    </div>
  );
};

export default memo(RecommentationFoodCard);

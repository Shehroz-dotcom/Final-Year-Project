import { memo, useContext, useEffect } from 'react';
import FoodCard from './foodCard.jsx';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';

const FoodCardContainer = () => {
  const { foodData, getFood , setFoodData } = useContext(FoodContext);
  
  //run this when page of components mounts
  useEffect(() => {
 
    getFood(); // fetch food data on mount
  }, []);

  if (!foodData || foodData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-white font-semibold">
        Empty database
      </div>
    );
  }

  return (
    <div
      className="w-full h-auto mt-8 flex flex-col items-center gap-6 
                md:flex-row md:flex-wrap md:justify-start"
    >
      {Array.isArray(foodData) &&
        foodData.map((food) => <FoodCard key={food._id} food={food} />)}
    </div>
  );
};

export default memo(FoodCardContainer);

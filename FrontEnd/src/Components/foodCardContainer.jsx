import { memo, useContext, useEffect, useState } from 'react';
import FoodCard from './foodCard.jsx';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';

const FoodCardContainer = () => {
  const { foodData, getFood } = useContext(FoodContext);
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    getFood();
  }, []);

  // ❌ FILTER LOGIC DISABLED (PASS ALL DATA DIRECTLY)
  useEffect(() => {
    if (!Array.isArray(foodData)) return;

    // OLD FILTER LOGIC (COMMENTED OUT)
    /*
    const results = foodData.filter((food) => {
      if (filters.category !== 'all' && food.food_category !== filters.category)
        return false;
      if (filters.type !== 'all' && food.food_type !== filters.type)
        return false;
      if (filters.tag !== 'all' && !food.tags?.includes(filters.tag))
        return false;
      if (
        filters.diet !== 'all' &&
        !food.diet_compatibility?.includes(filters.diet)
      )
        return false;
      if (
        filters.suitability !== 'all' &&
        !food.suitability?.includes(filters.suitability)
      )
        return false;

      const minC = Number(filters.minCalories) || 0;
      const maxC = filters.maxCalories ? Number(filters.maxCalories) : Infinity;
      if (food.calories < minC || food.calories > maxC) return false;

      const minP = Number(filters.minProtein) || 0;
      const maxP = filters.maxProtein ? Number(filters.maxProtein) : Infinity;
      if (food.protein < minP || food.protein > maxP) return false;

      return true;
    });

    setFilteredFoods(results);
    */

    // ✅ NO FILTERING → PASS ALL DATA
    setFilteredFoods(foodData);
  }, [foodData]);

  if (!foodData || foodData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-white font-semibold">
        Empty database
      </div>
    );
  }

  return (
    <div className="w-full mt-8 flex flex-col items-center gap-6">
      {/* FILTER UI STILL PRESENT (OPTIONAL - DOES NOTHING NOW) */}
      {/* <div className="w-full px-4 md:px-0 bg-black border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 justify-between">
        <p className="text-white text-sm opacity-60">
          Filters disabled — showing all food items
        </p>
      </div> */}

      {/* CARDS */}
      <div
        className="
          w-full
          px-4
          sm:px-6
          md:px-0
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
      >
        {filteredFoods.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default memo(FoodCardContainer);

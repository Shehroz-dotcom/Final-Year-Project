import { memo, useContext, useEffect, useState } from 'react';
import FoodCard from './foodCard.jsx';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';

const FoodCardContainer = () => {
  const { foodData, getFood } = useContext(FoodContext);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    minCalories: '',
    maxCalories: '',
    tag: 'all',
  });

  useEffect(() => {
    getFood();
  }, []);

  useEffect(() => {
    if (!Array.isArray(foodData)) return;

    const results = foodData.filter((food) => {
      if (filters.category !== 'all' && food.food_category !== filters.category)
        return false;

      if (filters.type !== 'all' && food.food_type !== filters.type)
        return false;

      const minC = Number(filters.minCalories) || 0;
      const maxC = filters.maxCalories ? Number(filters.maxCalories) : Infinity;
      if (food.calories < minC || food.calories > maxC) return false;

      if (filters.tag !== 'all' && !food.tags?.includes(filters.tag))
        return false;

      return true;
    });

    setFilteredFoods(results);
  }, [foodData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!foodData || foodData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-white font-semibold">
        Empty database
      </div>
    );
  }

  return (
    <div className="w-full h-auto mt-8 flex flex-col items-center gap-6 px-4 md:px-8">
      {/* ✅ Filter Section */}
      <div
        className="
        w-full max-w-5xl 
        bg-black 
        border border-white/10 
        rounded-lg 
        p-5 
        flex flex-col sm:flex-row sm:flex-wrap 
        items-start sm:items-center 
        gap-4 sm:gap-6 
        justify-between
      "
      >
        {/* Category */}
        <div className="flex flex-col text-white w-full sm:w-auto">
          <label className="text-xs uppercase text-gray-400 mb-1">
            Category
          </label>
          <select
            name="category"
            onChange={handleFilterChange}
            className="bg-zinc-900 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-green-400 text-sm"
          >
            <option value="all">All</option>
            <option value="Main Course">Main Course</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col text-white w-full sm:w-auto">
          <label className="text-xs uppercase text-gray-400 mb-1">Type</label>
          <select
            name="type"
            onChange={handleFilterChange}
            className="bg-zinc-900 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-green-400 text-sm"
          >
            <option value="all">All</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        {/* Tag */}
        <div className="flex flex-col text-white w-full sm:w-auto">
          <label className="text-xs uppercase text-gray-400 mb-1">Tag</label>
          <select
            name="tag"
            onChange={handleFilterChange}
            className="bg-zinc-900 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-green-400 text-sm"
          >
            <option value="all">All</option>
            <option value="high-protein">High Protein</option>
            <option value="low-carb">Low Carb</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        {/* Calories Range */}
        <div className="flex flex-col text-white w-full sm:w-auto">
          <label className="text-xs uppercase text-gray-400 mb-1">
            Calories Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minCalories"
              placeholder="Min"
              value={filters.minCalories}
              onChange={handleFilterChange}
              className="w-20 bg-zinc-900 border border-white/20 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-green-400"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              name="maxCalories"
              placeholder="Max"
              value={filters.maxCalories}
              onChange={handleFilterChange}
              className="w-20 bg-zinc-900 border border-white/20 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-green-400"
            />
          </div>
        </div>
      </div>

      {/* ✅ Food Cards Section */}
      <div className="w-full h-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => <FoodCard key={food._id} food={food} />)
        ) : (
          <p className=" mt-10 text-white font-bold">
            No items match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(FoodCardContainer);

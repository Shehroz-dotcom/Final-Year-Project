import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';
import { CartContext } from '../Context/CartContext/CartContext.jsx';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foodData } = useContext(FoodContext);
  const { addToCart } = useContext(CartContext);

  const [food, setFood] = useState(null);

  useEffect(() => {
    const selectedFood = foodData.find((item) => item._id === id);
    setFood(selectedFood);
  }, [id, foodData]);

  if (!food) {
    return (
      <div className="text-center text-white py-20">
        Loading food details...
      </div>
    );
  }

  const handleAddToCart = () => addToCart(food._id);

  const relatedFoods = foodData.slice(0, 4).filter((item) => item._id !== id);

  return (
    <div className="flex justify-center items-start py-6 sm:py-8 px-2 sm:px-4 lg:px-8">
      <div className="text-white bg-gradient-to-br from-[#0d0d0d]/80 to-[#1a1a1a]/60 backdrop-blur-md rounded-xl shadow-2xl mx-auto w-full sm:w-[95%] lg:w-[80%] px-4 sm:px-6 lg:px-12 py-6 sm:py-10 border border-white/10 animate-fadeIn">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-12">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={food.food_image_url}
              alt={food.food_name}
              className="w-full h-[260px] sm:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-[0_0_25px_rgba(0,255,100,0.15)]"
            />
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center mt-4 lg:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#f9f6f2] capitalize">
              {food.food_name}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg mb-4 leading-relaxed">
              {food.food_description || 'No description available.'}
            </p>

            <p className="text-gray-400 mb-3 text-sm italic">
              Serving Size: {food.serving_size_g} g
            </p>

            <p className="text-green-400 text-xl sm:text-2xl font-semibold mb-5">
              Price: PKR {Number(food.food_price).toFixed(2)}
            </p>

            {/* Nutrition Info */}
            <div className="bg-black/30 rounded-lg p-4 sm:p-5 mb-6 border border-white/10 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-yellow-400">
                Nutrition Information (per serving)
              </h2>
              <div className="text-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm sm:text-base">
                {food.protein > 0 && <p>Protein: {food.protein}g</p>}
                {food.carbs > 0 && <p>Carbs: {food.carbs}g</p>}
                {food.fat > 0 && <p>Fats: {food.fat}g</p>}
                {food.fiber > 0 && <p>Fiber: {food.fiber}g</p>}
                {food.sugar > 0 && <p>Sugar: {food.sugar}g</p>}
                <p className="col-span-2 sm:col-span-3 text-green-400 font-semibold">
                  Total Calories: {food.calories} kcal
                </p>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Customer Reviews
              </h3>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-xl">★★★★★</span>
                <p className="ml-2 text-gray-400 text-sm">(4.8 / 5)</p>
              </div>
              <p className="text-gray-300 text-sm italic">
                “Absolutely delicious and full of flavor. Portion was generous
                and worth every bite!”
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition-all duration-300 w-fit cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#f9f6f2]">
              You may also like
            </h3>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
              {relatedFoods.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[160px] sm:min-w-[200px] bg-black/40 rounded-lg p-3 hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/10"
                  onClick={() => navigate(`/food/${item._id}`)}
                >
                  <img
                    src={item.food_image_url}
                    alt={item.food_name}
                    className="w-full h-28 sm:h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm text-white font-semibold text-center">
                    {item.food_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;

import foodImage from '../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext/UserContext';
import { CartContext } from '../Context/CartContext/CartContext.jsx';

const FoodCard = ({ food }) => {
  const { userData } = useContext(UserContext);
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // get quantity of this food from cart
  const quantity = cartItems?.[food._id] || 0;

  const handleAdd = () => {
    e.stopPropagation()
    if (!userData) {
      navigate('/login');
      return;
    }
    addToCart(food._id);
  };

  const handleRemove = () => {
    e.stopPropagation()
    removeFromCart(food._id);
  };

  // ✅ Calculate calories (per serving only)
  const protein = Number(food?.protein) || 0;
  const carbs = Number(food?.carbs) || 0;
  const fats = Number(food?.fats) || 0;

  // 4, 4, and 9 are the kcal per gram of protein, carbs, and fat respectively
  const calories = (protein * 4 + carbs * 4 + fats * 9) * 1; // *1 = per serving

  return (
    <div className="w-80 rounded-lg bg-[#0d0d0d]/80 backdrop-blur-md shadow-lg flex flex-col h-auto transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl" onClick={() => navigate(`/food/${food._id}`)}>
      {/* 🖼️ Image Section */}
      <div className="relative cursor-pointer">
        <img
          src={food.food_image_url || foodImage}
          alt={food.food_name}
          className="w-full h-48 object-cover rounded-t-md"
        />

        {/* Add/Remove buttons */}
        {quantity === 0 ? (
          <IoIosAdd
            onClick={handleAdd}
            className="absolute bottom-2 right-2 text-3xl text-black bg-white rounded-full p-1 cursor-pointer hover:bg-green-400 hover:scale-110 transition-transform duration-300 font-bold "
          />
        ) : (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-md">
            <IoIosRemove
              onClick={handleRemove}
              className="text-2xl text-white cursor-pointer hover:text-red-400 transition"
            />
            <span className="text-white font-bold">{quantity}</span>
            <IoIosAdd
              onClick={handleAdd}
              className="text-2xl text-white cursor-pointer hover:text-green-400 transition"
            />
          </div>
        )}
      </div>

      {/* 🧾 Content Section */}
      <div className="p-4 flex flex-col justify-between text-white">
        <h2 className="text-lg sm:text-xl font-bold text-[#f9f6f2]">
          {food.food_name}
        </h2>

        <p className="mt-2 text-sm text-[#c9c9c9] line-clamp-3">
          {food.food_description}
        </p>

        <p className="mt-2 text-[#02b11f] font-semibold">
          PKR {Number(food.food_price).toFixed(2)}
        </p>

        {/* 🍽️ Nutrition Info */}
        <div className="mt-2 text-xs sm:text-sm text-gray-300 flex flex-wrap gap-x-4 gap-y-1">
          {food?.protein && <p>Protein: {protein}g</p>}
          {food?.carbs && <p>Carbs: {carbs}g</p>}
          {food?.fats && <p>Fats: {fats}g</p>}
          {food?.fiber && <p>Fiber: {food.fiber}g</p>}
          {food?.sugar && <p>Sugar: {food.sugar}g</p>}
        </div>

        {/* 🔥 Total Calories per Serving */}
        <p className="mt-2 text-[13px] sm:text-sm font-semibold">
          <span className="text-yellow-400">Total Calories:</span>{' '}
          <span className="text-green-400">{calories.toFixed(0)} kcal</span>
        </p>
      </div>
    </div>
  );
};

export default FoodCard;

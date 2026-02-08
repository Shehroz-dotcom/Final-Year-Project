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

  const quantity = cartItems?.[food._id] || 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!userData) {
      navigate('/login');
      return;
    }
    addToCart(food._id);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromCart(food._id);
  };

  const protein = Number(food?.protein) || 0;
  const carbs = Number(food?.carbs) || 0;
  const fats = Number(food?.fats) || 0;
  const calories = protein * 4 + carbs * 4 + fats * 9;

  return (
    <div
      className="
      cursor-pointer
        w-full
        rounded-lg
        bg-[#0d0d0d]/80
        backdrop-blur-md
        shadow-lg
        flex
        flex-col
        transition-transform  duration-150 ease-in-out hover:scale-[1.03] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)]
      "
      onClick={() => navigate(`/food/${food._id}`)}
    >
      {/* 🖼 Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          src={food.food_image_url || foodImage}
          alt={food.food_name}
          className="w-full h-full object-cover"
        />

        {quantity === 0 ? (
          <IoIosAdd
            onClick={handleAdd}
            className="
              absolute bottom-2 right-2
              text-3xl
              text-black
              bg-white
              rounded-full
              p-1
              cursor-pointer
              hover:bg-green-400
              transition
            "
          />
        ) : (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-md">
            <IoIosRemove
              onClick={handleRemove}
              className="text-2xl text-white cursor-pointer hover:text-red-400"
            />
            <span className="text-white font-bold">{quantity}</span>
            <IoIosAdd
              onClick={handleAdd}
              className="text-2xl text-white cursor-pointer hover:text-green-400"
            />
          </div>
        )}
      </div>

      {/* 🧾 Content */}
      <div className="p-4 flex flex-col gap-2 text-white">
        <h2 className="text-lg font-bold text-[#f9f6f2]">{food.food_name}</h2>

        <p className="text-sm text-[#c9c9c9] line-clamp-3">
          {food.food_description}
        </p>

        <p className="text-[#02b11f] font-semibold">
          PKR {Number(food.food_price).toFixed(2)}
        </p>

        <div className="text-xs sm:text-sm text-gray-300 flex flex-wrap gap-x-4 gap-y-1">
          {protein > 0 && <p>Protein: {protein}g</p>}
          {carbs > 0 && <p>Carbs: {carbs}g</p>}
          {fats > 0 && <p>Fats: {fats}g</p>}
          {food?.fiber && <p>Fiber: {food.fiber}g</p>}
          {food?.sugar && <p>Sugar: {food.sugar}g</p>}
        </div>

        <p className="text-sm font-semibold">
          <span className="text-yellow-400">Total Calories:</span>{' '}
          <span className="text-green-400">{calories.toFixed(0)} kcal</span>
        </p>
      </div>
    </div>
  );
};

export default FoodCard;

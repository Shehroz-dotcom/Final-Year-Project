import { memo, useContext, useEffect, useState } from 'react';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';
import { toast } from 'react-toastify';
import { CartContext } from '../Context/CartContext/CartContext.jsx';
import Urls from '../utils/Urls.js';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const Cart = () => {
  const { foodData, getFood } = useContext(FoodContext);

  const { cartItems, removeFromCart, addToCart, removeItemCompletely } =
    useContext(CartContext);

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    getFood();
  }, []);

  useEffect(() => {
    if (
      !Array.isArray(foodData) ||
      typeof cartItems !== 'object' ||
      !cartItems
    ) {
      setFilteredFoods([]);
      setTotalPrice(0);
      setTotalCalories(0);
      return;
    }

    let filtered = [];
    let priceSum = 0;
    let calorieSum = 0;

    for (const food of foodData) {
      const qty = Number(cartItems[food._id]);
      if (qty > 0) {
        filtered.push(food);
        const price = Number(food.food_price) || 0;
        const calories = Number(food.calories) || 0;
        priceSum += price * qty;
        calorieSum += calories * qty;
      }
    }

    setFilteredFoods(filtered);
    setTotalPrice(priceSum);
    setTotalCalories(calorieSum);
  }, [foodData, cartItems]);

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        name,
        address,
        cart: cartItems,
        totalPrice: totalPrice.toFixed(2),
        totalCalories,
      };

      await axios.post(`${Urls.dev}/api/v1/user/order`, payload, {
        withCredentials: true,
      });

      await axios.post(`${Urls.dev}/api/v1/order/placeOrder`, payload, {
        withCredentials: true,
      });
      console.log(response);

      toast.success('🛒 Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => {
        sessionStorage.removeItem('cart');
      }, 100); // delay prevents unmount before toast renders
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('❌ Failed to place order. Try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE – Cart Items */}
        <div className="md:w-[70%] w-full">
          <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-3">
            Your Cart
          </h2>

          {filteredFoods.length === 0 ? (
            <p className="text-gray-400">No items in your cart.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredFoods.map((food) => {
                const quantity = Number(cartItems[food._id]) || 0;
                const price = Number(food.food_price) || 0;

                return (
                  <div
                    key={food._id}
                    className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={food.food_image_url || '/placeholder.jpg'}
                        alt={food.food_name}
                        className="w-16 h-16 object-cover rounded-md border border-white/20"
                      />
                      <div>
                        <p className="font-semibold text-lg">
                          {food.food_name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          PKR {price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/20 rounded-md">
                        <button
                          className="px-2 py-1 hover:bg-white hover:text-black transition"
                          onClick={() => addToCart(food._id)}
                        >
                          +
                        </button>
                        <span className="px-3">{quantity}</span>
                        <button
                          className="px-2 py-1 hover:bg-white hover:text-black transition"
                          onClick={() => removeFromCart(food._id)}
                        >
                          -
                        </button>
                      </div>
                      <button
                        onClick={() => removeItemCompletely(food._id)}
                        className="text-red-500 hover:text-white transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE – Bill Summary */}
        <div className="md:w-[30%] w-full space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">
              Bill Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>PKR 200</span>
              </div>

              <div className="border-t border-white/20 my-2" />
              <div className="flex justify-between font-semibold text-green-400">
                <span>Total</span>
                <span>PKR {(totalPrice * 1.08 + 200).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-green-400 transition"
          >
            Checkout
          </button>

          {/* 🏠 Delivery Address Input */}
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
            <input
              type="text"
              name="DeliveryAddress"
              placeholder="Enter your delivery address"
              className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 text-white outline-none focus:border-green-400 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);

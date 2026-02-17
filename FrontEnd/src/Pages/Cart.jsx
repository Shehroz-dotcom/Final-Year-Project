import { memo, useContext, useEffect, useState } from 'react';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { toast } from 'react-toastify';
import { CartContext } from '../Context/CartContext/CartContext.jsx';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Urls from '../utils/Urls.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const { foodData, getFood } = useContext(FoodContext);
  const { userData } = useContext(UserContext);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
  } = useContext(CartContext);

  const stripe = useStripe();
  const elements = useElements();

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(false);

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
        priceSum += (Number(food.food_price) || 0) * qty;
        calorieSum += (Number(food.calories) || 0) * qty;
      }
    }

    setFilteredFoods(filtered);
    setTotalPrice(priceSum);
    setTotalCalories(calorieSum);
  }, [foodData, cartItems]);

  const handlePayment = async () => {
    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet.');
      return;
    }

    setLoading(true);

    try {
      const cartArray = Object.entries(cartItems).map(([foodId, quantity]) => ({
        foodId,
        quantity,
      }));

      const { data } = await axios.post(
        `${Urls.dev}/api/v1/payment/create-payment-intent`,
        { totalPrice },
        { withCredentials: true }
      );

      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error('Failed to get payment client secret');

      const cardNumber = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: userData.fullName,
            email: userData.email,
            address: { line1: userData.address || '' },
          },
        },
      });

      if (paymentResult.error) throw new Error(paymentResult.error.message);

      if (paymentResult.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Placing order...');
        await handleCheckout(cartArray);
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      toast.error(`Payment failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleCheckout = async (cartArray) => {
    try {
      const payload = { cart: cartArray, totalPrice };
      const orderResponse = await axios.post(
        `${Urls.dev}/api/v1/order/placeOrder`,
        payload,
        { withCredentials: true }
      );

      if (!orderResponse.data?.success) {
        throw new Error(orderResponse.data?.message || 'Failed to place order');
      }

      toast.success('🛒 Order placed successfully!');
      clearCart();
      navigate(
        `/orderStatus/${orderResponse.data.branchCode}/${orderResponse.data.order}`
      );

      // Update nutrition data
      await axios.post(
        `${Urls.dev}/api/v1/user/saveNutritions`,
        { cart: cartArray },
        { withCredentials: true }
      );
      await axios.post(
        `${Urls.dev}/api/v1/order/UpdateFoodNutrition`,
        { cart: cartArray },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(
        `❌ Checkout failed: ${error.response?.data?.message || error.message}`
      );
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

        {/* RIGHT SIDE – Bill & Payment */}
        <div className="md:w-[30%] w-full space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">
              Bill Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {totalPrice.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Delivery</span>
                <span>PKR 200</span>
              </div> */}
              <div className="border-t border-white/20 my-2" />
              <div className="flex justify-between font-semibold text-green-400">
                <span>Total</span>
                <span>PKR {(totalPrice  ).toFixed(2)}</span>
              </div>
            </div>

            {/* Stripe Card Inputs */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Card Number
                </label>
                <div className="bg-zinc-800 p-3 rounded-md border border-white/20">
                  <CardNumberElement
                    options={{
                      style: { base: { color: '#fff', fontSize: '16px' } },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Expiry Date
                </label>
                <div className="bg-zinc-800 p-3 rounded-md border border-white/20">
                  <CardExpiryElement
                    options={{
                      style: { base: { color: '#fff', fontSize: '16px' } },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">CVC</label>
                <div className="bg-zinc-800 p-3 rounded-md border border-white/20">
                  <CardCvcElement
                    options={{
                      style: { base: { color: '#fff', fontSize: '16px' } },
                    }}
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-semibold mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full bg-zinc-800 p-3 rounded-md border border-white/20 text-white placeholder-gray-400 outline-none focus:border-green-400 transition"
                />
              </div> */}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#635bff] text-white font-semibold py-3 rounded-md hover:bg-[#4a47c1] transition"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>

            {/* Delivery Address */}
            <div className="bg-zinc-900 border border-white/10 rounded-md p-3 mt-4">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <input
                type="text"
                readOnly
                value={userData.address}
                placeholder="Enter your delivery address"
                className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2 text-white outline-none focus:border-green-400 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);

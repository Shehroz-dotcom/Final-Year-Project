import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../utils/Urls.js';

const OrderStatus = () => {
  const { orderId, branchCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [orderDelivered, setOrderDelivered] = useState(false); // track if marked delivered

  // Fetch order function
  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${Urls.dev}/api/v1/order/getOrder/${branchCode}/${orderId}`
      );
      setOrder(response.data.order);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order once on mount
  useEffect(() => {
    fetchOrder();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Fetch order every 10 minutes until mark delivered becomes active
  useEffect(() => {
    if (timeLeft <= 5 * 60 || orderDelivered) return; // stop fetching when 5 min left or delivered

    const fetchInterval = setInterval(
      () => {
        fetchOrder();
      },
      10 * 60 * 1000
    ); // 10 minutes

    return () => clearInterval(fetchInterval);
  }, [timeLeft, orderDelivered]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isMarkDeliveredActive = timeLeft <= 5 * 60;

  const handleMarkDelivered = () => {
    setOrderDelivered(true); // stop further API calls
    alert('Order marked as delivered!');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-lg">
        {error}
      </div>
    );
  if (!order)
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        No order found
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 px-4 py-8 rounded-3xl">
      <div className="bg-black backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Order Status</h2>

        <div className="mb-4 text-center">
          <span className="text-yellow-400 font-bold text-xl">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="mb-4 space-y-2">
          <p>
            <span className="font-semibold">Status:</span> {order.status}
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-2">Items</h3>
        <ul className="space-y-1 mb-4">
          {order.items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors"
            >
              <span>{item.name}</span>
              <span className="font-semibold text-yellow-500">
                x {item.quantity}
              </span>
            </li>
          ))}
        </ul>

        <p className="mb-6">
          <span className="font-semibold">Total:</span>{' '}
          <span className="text-green-400 font-bold">
            Rs {order.totalPrice}
          </span>
        </p>

        <button
          onClick={handleMarkDelivered}
          disabled={!isMarkDeliveredActive}
          className={`w-full py-2 rounded-md font-semibold transition-colors
            ${
              isMarkDeliveredActive
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
        >
          Mark Delivered
        </button>
        <p className="text-red-600 font-bold mt-4">
          Don't leave this page ... !
        </p>
      </div>
    </div>
  );
};

export default memo(OrderStatus);

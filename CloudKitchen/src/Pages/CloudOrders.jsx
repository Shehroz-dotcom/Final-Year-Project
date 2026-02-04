import { memo, useEffect, useState, useContext } from "react";
import { CloudContext } from "../Context/CloudKitchenContext.jsx";
import React from "react";
import axios from "axios";
import Urls from "../../../FrontEnd/src/utils/Urls.js"
// Status options for the dropdown
const STATUS_OPTIONS = ["placed", "cooking", "out for delivery", "delivered"];

const CloudOrders = () => {
  const { FetchOrders, handleStatusChange , Logout} = useContext(CloudContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await FetchOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [FetchOrders]);

  // Update order status
  const statusChange = async (orderId, newStatus) => {
    try {
      const res = await handleStatusChange(orderId, newStatus);
      if (res?.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, status: newStatus }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Status update failed");
    }
  };

 

  if (loading) {
    return (
      <p className="text-white text-center mt-10 text-lg">Loading orders…</p>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header with title and logout button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Cloud Orders</h2>
        <button
          onClick={Logout}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 cursor-pointer text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <p className="text-white/70">No orders found</p>
      ) : (
        <div className="space-y-4 cursor-pointer">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="relative flex flex-col md:flex-row justify-between items-start md:items-center backdrop-blur-md border border-white/20 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Order details */}
              <div className="flex-1">
                <p className="text-white font-semibold">
                  Order ID:{" "}
                  <span className="text-white/70">{order.order_id}</span>
                </p>
                <p className="text-white">
                  Ordered By:{" "}
                  <span className="text-white/70">{order.orderedBy}</span>
                </p>
                <p className="text-white">
                  Total:{" "}
                  <span className="text-white/70">
                    <span className="text-green-400 font-bold">Rs</span>{" "}
                    {order.totalPrice}
                  </span>
                </p>
                <p className="text-white">
                  Delivery Address:{" "}
                  <span className="text-white/70">{order.deliveryAddress}</span>
                </p>

                <ul className="mt-2 list-disc list-inside text-white/70">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status Select */}
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end">
                <label className="text-white/70 text-sm mb-1">Status</label>
                <select
                  className="px-3 py-1 rounded-md border border-white/20 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  value={order.status}
                  onChange={(e) => statusChange(order.order_id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CloudOrders);

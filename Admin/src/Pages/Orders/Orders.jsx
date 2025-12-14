import { useEffect, useState } from "react";
import Urls from "../../Utils/Url.js";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${Urls.dev}/api/v1/order/getOrders`);

        // THIS is the actual orders array
        setOrders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-white font-bold py-4 px-2 ">Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-5 text-white shadow-lg"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg font-semibold">
              <span className="text-blue-400">Ordered By:</span>{" "}
              <span className="text-white">{order.name}</span>
            </p>

            <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-semibold">
              Unpaid
            </span>
          </div>

          {/* Address */}
          <p className="text-sm mb-4">
            <span className="text-purple-400 font-bold">Delivery Address:</span>{" "}
            <span className="text-gray-300">{order.address}</span>
          </p>

          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm border-b border-white/10 pb-1"
              >
                <span>
                  <span className="text-yellow-300 font-semibold">
                    Item {index + 1}:
                  </span>{" "}
                  <span className="text-teal-400">{item.foodName}</span>{" "}
                  <span className="text-amber-400">× {item.quantity}</span>
                </span>

                <span className="font-medium text-green-400">
                  ₹{item.total}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center border-t border-white/20 pt-3">
            <p className="text-lg font-bold text-green-500">
              Total: Rs {order.amount}
            </p>

            <p className="text-sm">
              <span className="text-yellow-400">Status:</span>{" "}
              <span className="text-gray-300">{order.status}</span>
            </p>
          </div>
        </div>
      ))}
      I
    </div>
  );
};

export default Orders;

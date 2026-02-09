import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Urls from "../../../../FrontEnd/src/utils/Urls.js";

const GetOrders = () => {
  const { kitchenId } = useParams();
  const [orders, setOrders] = useState([]);
  const [branchCode, setBranchCode] = useState(""); // store branch code
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${Urls.dev}/api/v1/admin/getOrders/${kitchenId}`
        );
        setOrders(res.data.orders || []);
        setBranchCode(res.data.branchCode || "N/A"); // set branch code
      } catch (error) {
        console.error("Failed to fetch orders:", error.response?.data || error);
        setOrders([]);
        setBranchCode("N/A");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [kitchenId]);

  if (loading) {
    return <p className="text-white">Loading orders...</p>;
  }

  return (
    <div className="text-white p-6 ">
      <h2 className="text-2xl font-bold mb-4 bg-black p-4">
        Orders for kitchen Branch Code: {branchCode}
      </h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="border border-white/20 rounded p-4 bg-black/70 " 
            >
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> Rs {order.totalPrice}
              </p>

              <div className="mt-2">
                <strong>Items:</strong>
                <ul className="ml-4 list-disc">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - x : {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetOrders;

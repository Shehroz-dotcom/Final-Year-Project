import { useParams } from "react-router-dom";

const DeliveredOrders = () => {
  const { id } = useParams(); // this will be kitchen._id
  return <div className="text-white">Delivered orders for kitchen {id}</div>;
};


export default DeliveredOrders;
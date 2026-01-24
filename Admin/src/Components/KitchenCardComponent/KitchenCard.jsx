import { memo } from "react";
import { useNavigate } from "react-router-dom";

const KitchenCard = ({ kitchen }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition text-green-500">
      <h2 className="text-lg font-semibold">
        Branch Code: {kitchen.branch_code}
      </h2>

      <p className=" mt-2 text-white">Address: {kitchen.address}</p>

      <button
        onClick={() => navigate(`/kitchens/${kitchen._id}/delivered-orders`)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md font-medium
             hover:bg-green-700 active:bg-green-800 transition-colors duration-200 cursor-pointer"
      >
        See Delivered Orders
      </button>
    </div>
  );
};

export default memo(KitchenCard);

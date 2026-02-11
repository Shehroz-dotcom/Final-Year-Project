// KitchenCard.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const KitchenCard = ({ kitchen, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition text-green-500">
      <h2 className="text-lg font-semibold">
        Branch Code: {kitchen.branch_code}
      </h2>

      <p className="mt-2 text-white">Address: {kitchen.address}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/kitchens/${kitchen._id}`)}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium
                     hover:bg-green-700 active:bg-green-800 transition-colors"
        >
          See  Orders
        </button>

        <button
          onClick={() => onDelete(kitchen.branch_code)}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium
                     hover:bg-red-700 active:bg-red-800 transition-colors"
        >
          Delete Kitchen
        </button>
      </div>
    </div>
  );
};

export default memo(KitchenCard);

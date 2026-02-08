// AllKitchens.jsx
import { useEffect, useState } from "react";
import KitchenCard from "../../Components/KitchenCardComponent/KitchenCard.jsx";
import axios from "axios";
import Urls from "../../Utils/Url.js";

const AllKitchens = () => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKitchens = async () => {
    try {
      const res = await axios.get(`${Urls.dev}/api/v1/cloud/getAllKitchens`);
      if (res.data.success) {
        setKitchens(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch kitchens", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  // 🔥 DELETE HANDLER HERE
  const handleDeleteKitchen = async (branch_code) => {
    try {
      const res = await axios.post(`${Urls.dev}/api/v1/cloud/deleteKitchen`, {
        branch_code,
      });

      if (res.data.success) {
        // remove deleted kitchen from state
        setKitchens((prev) =>
          prev.filter((k) => k.branch_code !== branch_code),
        );
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading kitchens...</div>;
  }

  if (kitchens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <span className="text-5xl mb-4">🍽️</span>
        <h2 className="text-xl font-semibold text-white">
          No cloud kitchens available
        </h2>
        <p className="mt-2 text-sm text-white">
          Create your first kitchen to start receiving orders.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {kitchens.map((kitchen) => (
          <KitchenCard
            key={kitchen._id}
            kitchen={kitchen}
            onDelete={handleDeleteKitchen} // 👈 pass down
          />
        ))}
      </div>
    </div>
  );
};

export default AllKitchens;

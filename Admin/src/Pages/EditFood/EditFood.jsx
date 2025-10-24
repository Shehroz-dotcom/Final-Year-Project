import axios from "axios";
import Button from "../../Components/Button/Button.jsx";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Urls from "../../Utils/Url.js";

const EditFood = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const fetchFoodDetails = async () => {
    try {
      const response = await axios.get(
        `${Urls.dev}/api/v1/food/getFoodDetails`,
        {
          params: { name },
        }
      );

      const data = response.data.data;
      if (!data) {
        toast.info("Food not present in database frontend");
        return;
      }

      reset(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching food data");
    }
  };

  useEffect(() => {
    if (name) {
      fetchFoodDetails();
    }
  }, [name]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true); 
      await axios.put(
        `${Urls.dev}/api/v1/food/updateFood`,
        formData
      );
      toast.success("Food updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating food ");
    } finally {
      setLoading(false);
    }
  };

  // Common style for all inputs
  const inputStyle =
    "w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-white text-2xl font-extrabold mb-6">Edit Food</h1>

      {/* Transparent black wrapper */}
      <div className="bg-black/50 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Food Name */}
          <div>
            <label htmlFor="food_name" className="block text-white mb-1 font-bold">
              Food Name
            </label>
            <input
              type="text"
              id="food_name"
              placeholder="Type here"
              {...register("food_name", { required: true })}
              className={inputStyle}
              readOnly
              
            />
          </div>

          {/* Food Description */}
          <div>
            <label htmlFor="food_description" className="block text-white mb-1 font-bold">
              Description
            </label>
            <textarea
              id="food_description"
              placeholder="Type here"
              {...register("food_description")}
              className={`${inputStyle} resize-y`}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="food_price" className="block text-white mb-1">
              Price
            </label>
            <input
              type="number"
              id="food_price"
              placeholder="0"
              {...register("food_price")}
              className={inputStyle}
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="food_category" className="block text-white mb-1">
                Category
              </label>
              <input
                type="text"
                id="food_category"
                placeholder="Type here"
                {...register("food_category")}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="food_type" className="block text-white mb-1">
                Type
              </label>
              <input
                type="text"
                id="food_type"
                placeholder="Type here"
                {...register("food_type")}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Nutrition Fields */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["protein", "carbs", "fat", "fiber", "sugar"].map((nutrient) => (
              <div key={nutrient}>
                <label
                  htmlFor={nutrient}
                  className="block text-white mb-1 capitalize"
                >
                  {nutrient}
                </label>
                <input
                  type="number"
                  id={nutrient}
                  placeholder="0"
                  {...register(nutrient)}
                  className={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Image URL */}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full  text-white py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-green-500 border border-white bg-black hover:border-black"
          >
            {loading ? "Updating..." : "Update Food"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditFood;

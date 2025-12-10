import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import Url from "../../Utils/Url.js";
import Button from "../../Components/Button/Button.jsx";

const AddFood = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!file) {
        toast.error("Please upload an image");
        return;
      }

      formData.append("foodPic", file);

      // Add all schema fields
      formData.append("food_name", data.food_name);
      formData.append("food_description", data.food_description);
      formData.append("food_price", data.food_price);
      formData.append("food_category", data.food_category);
      formData.append("food_type", data.food_type);
      formData.append("calories", data.calories);
      formData.append("serving_size_g", data.serving_size_g);
      formData.append("protein", data.protein);
      formData.append("carbs", data.carbs);
      formData.append("fat", data.fat);
      formData.append("fiber", data.fiber);
      formData.append("sugar", data.sugar);
      formData.append("tags", data.tags || "");

      const response = await axios.post(
        `${Url.dev}/api/v1/food/addFood`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        setPreview(null);
        setFile(null);
      } else {
        toast.error("Data not uploaded");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Something went wrong";
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-black/50 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-md">
          Add New Food Item
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <p className="mb-2 font-medium text-white">Upload Image</p>
          <label
            htmlFor="foodPic"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/60 rounded-lg cursor-pointer hover:border-white transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center">
                <MdCloudUpload className="text-6xl text-white mb-2 opacity-80" />
                <span className="text-white/80 text-sm">Click to upload</span>
              </div>
            )}
          </label>

          <input
            type="file"
            id="foodPic"
            hidden
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />
          {!file && (
            <p className="text-red-400 text-sm mt-1">Image is required</p>
          )}
        </div>

        {/* Food Name */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-1">Food Name</label>
          <input
            type="text"
            {...register("food_name", { required: true })}
            className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
            placeholder="e.g. Grilled Chicken Bowl"
          />
          {errors.food_name && (
            <p className="text-red-400 text-sm mt-1">Name is required</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-1">
            Description
          </label>
          <textarea
            {...register("food_description", { required: true })}
            className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
            placeholder="Describe the dish"
            rows="3"
          ></textarea>
          {errors.food_description && (
            <p className="text-red-400 text-sm mt-1">Description is required</p>
          )}
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white font-medium mb-1">
              Category
            </label>
            <select
              {...register("food_category", { required: true })}
              className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
            >
              <option value="">Select</option>
              <option value="Main Course" className="text-black">
                Main Course
              </option>
              <option value="Snacks" className="text-black">
                Snacks
              </option>
              <option value="Breakfast" className="text-black">
                Breakfast
              </option>
            </select>
            {errors.food_category && (
              <p className="text-red-400 text-sm mt-1">Category is required</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Price</label>
            <input
              type="number"
              {...register("food_price", {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
              placeholder="Rs 150"
            />
            {errors.food_price && (
              <p className="text-red-400 text-sm mt-1">Price is required</p>
            )}
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-1">Type</label>
          <select
            {...register("food_type", { required: true })}
            className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
          >
            <option value="">Select</option>
            <option value="breakfast" className="text-black">
              Breakfast
            </option>
            <option value="lunch" className="text-black">
              Lunch
            </option>
            <option value="dinner" className="text-black">
              Dinner
            </option>
          </select>
          {errors.food_type && (
            <p className="text-red-400 text-sm mt-1">Type is required</p>
          )}
        </div>

        {/* Calories & Serving Size */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white font-medium mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              {...register("calories", { required: true, valueAsNumber: true })}
              className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
            />
            {errors.calories && (
              <p className="text-red-400 text-sm mt-1">Calories are required</p>
            )}
          </div>
          <div>
            <label className="block text-white font-medium mb-1">
              Serving Size (g)
            </label>
            <input
              type="number"
              {...register("serving_size_g", {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
            />
            {errors.serving_size_g && (
              <p className="text-red-400 text-sm mt-1">
                Serving size is required
              </p>
            )}
          </div>
        </div>

        {/* Nutrition Fields */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {["protein", "carbs", "fat", "fiber", "sugar"].map((nutrient) => (
            <div key={nutrient}>
              <label className="block text-white font-medium mb-1 capitalize">
                {nutrient} (g)
              </label>
              <input
                type="number"
                {...register(nutrient, { required: true, valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
              />
              {errors[nutrient] && (
                <p className="text-red-400 text-sm mt-1">
                  {nutrient} is required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Suitability */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-1">
            Suitability
          </label>
          <input
            type="text"
            {...register("suitability")}
            placeholder="e.g. post-workout, low-calorie, recovery"
            className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
          />
          <p className="text-xs text-white/60 mt-1">
            Separate multiple suitability tags with commas.
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-1">Tags</label>
          <input
            type="text"
            {...register("tags")}
            placeholder="e.g. high-protein, low-carb"
            className="w-full px-3 py-2 rounded-md bg-white/20 border border-white/40 text-white"
          />
          <p className="text-xs text-white/60 mt-1">
            Separate tags with commas.
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-black border-white border hover:font-bold hover:text-black"
        >
          Save Food Item
        </Button>
      </form>
    </div>
  );
};

export default AddFood;

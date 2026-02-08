import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import Url from "../../Utils/Url.js";
import Button from "../../Components/Button/Button.jsx";

const inputBase =
  "w-full px-3 py-2 rounded-md bg-white/15 border border-white/30 text-white placeholder-white/60 " +
  "focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-white/80 " +
  "transition disabled:opacity-50 disabled:cursor-not-allowed";

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
      if (!file) {
        toast.error("Please upload an image");
        return;
      }

      const formData = new FormData();

      formData.append("foodPic", file);

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

      data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((tag) => formData.append("tags[]", tag));

      data.suitability
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((item) => formData.append("suitability[]", item));

      (data.diet_compatibility || []).forEach((d) =>
        formData.append("diet_compatibility[]", d)
      );

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
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-black/50 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add New Food Item
        </h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label
            htmlFor="foodPic"
            className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/50 rounded-lg cursor-pointer hover:border-white transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <>
                <MdCloudUpload className="text-6xl text-white mb-2 opacity-80" />
                <span className="text-white/70 text-sm">
                  Click to upload image
                </span>
              </>
            )}
          </label>
          <input
            type="file"
            id="foodPic"
            hidden
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />
        </div>

        {/* Food Name */}
        <Field label="Food Name" error={errors.food_name}>
          <input
            {...register("food_name", { required: true })}
            className={inputBase}
          />
        </Field>

        {/* Description */}
        <Field label="Description" error={errors.food_description}>
          <textarea
            {...register("food_description", { required: true })}
            className={inputBase}
            rows={3}
          />
        </Field>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" error={errors.food_category}>
            <select
              {...register("food_category", { required: true })}
              className={inputBase}
            >
              <option value="" className="text-black">Select</option>
              <option value="Main Course" className="text-black">Main Course</option>
              <option value="Snacks" className="text-black">Snacks</option>
              <option value="Breakfast" className="text-black">Breakfast</option>
              <option value="Salad " className="text-black">Salad</option>
            </select>
          </Field>

          <Field label="Price" error={errors.food_price}>
            <input
              type="number"
              {...register("food_price", { required: true })}
              className={inputBase}
            />
          </Field>
        </div>

        {/* Food Type */}
        <Field label="Food Type" error={errors.food_type}>
          <select
            {...register("food_type", { required: true })}
            className={inputBase}
          >
            <option value="">Select</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </Field>

        {/* Calories & Serving */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Calories" error={errors.calories}>
            <input
              type="number"
              {...register("calories", { required: true })}
              className={inputBase}
            />
          </Field>

          <Field label="Serving Size (g)" error={errors.serving_size_g}>
            <input
              type="number"
              {...register("serving_size_g", { required: true })}
              className={inputBase}
            />
          </Field>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          {["protein", "carbs", "fat", "fiber", "sugar"].map((n) => (
            <Field key={n} label={`${n} (g)`} error={errors[n]}>
              <input
                type="number"
                {...register(n, { required: true })}
                className={inputBase}
              />
            </Field>
          ))}
        </div>

        {/* Diet Compatibility */}
        <Field label="Diet Compatibility">
          <select
            multiple
            {...register("diet_compatibility")}
            className={inputBase}
          >
            {[
              "omnivore",
              "vegetarian",
              "vegan",
              "keto",
              "paleo",
              "gluten-free",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        {/* Suitability */}
        <Field label="Suitability (comma separated)">
          <input
            {...register("suitability")}
            className={inputBase}
            placeholder="e.g. post-workout, low-calorie, recovery"
          />
        </Field>

        {/* Tags */}
        <Field label="Tags (comma separated)" error={errors.tags}>
          <input
            {...register("tags", { required: true })}
            className={inputBase}
            placeholder="e.g. high-protein, low-carb, gluten-free"
          />
        </Field>

        <Button type="submit" className="mt-4 border-green-400 text-white">
          Save Food Item
        </Button>
      </form>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div className="mb-4">
    <label className="block text-white mb-1 font-medium">{label}</label>
    {children}
    {error && (
      <p className="text-red-400 text-sm mt-1">This field is required</p>
    )}
  </div>
);
// add the remaining dishes details added new input feilds 
export default AddFood;

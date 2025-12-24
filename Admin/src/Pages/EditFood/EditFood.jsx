import axios from "axios";
import Button from "../../Components/Button/Button.jsx";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Urls from "../../Utils/Url.js";
import { MdCloudUpload } from "react-icons/md";

const DIET_OPTIONS = [
  "omnivore",
  "vegetarian",
  "vegan",
  "keto",
  "paleo",
  "gluten-free",
];

const inputBase =
  "w-full px-3 py-2 rounded-md bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-white/80 transition";

const EditFood = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      diet_compatibility: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchFoodDetails = async () => {
    try {
      const response = await axios.get(
        `${Urls.dev}/api/v1/food/getFoodDetails`,
        { params: { name } }
      );

      const data = response.data.data;
      if (!data) {
        toast.info("Food not present in database");
        return;
      }

      reset(data);
      if (data.food_image_url) setPreview(data.food_image_url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching food data");
    }
  };

  useEffect(() => {
    if (name) fetchFoodDetails();
  }, [name]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();

      /* Append all fields */
      [
        "food_name",
        "food_description",
        "food_price",
        "food_category",
        "food_type",
        "calories",
        "serving_size_g",
        "protein",
        "carbs",
        "fat",
        "fiber",
        "sugar",
      ].forEach((key) => {
        payload.append(key, formData[key]);
      });

      /* Image */
      if (file) payload.append("foodPic", file);

      /* Tags */
      (formData.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => {
          payload.append("tags[]", t);
        });

      /* Suitability */
      (formData.suitability || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => {
          payload.append("suitability[]", s);
        });

      /* Diet Compatibility */
      (formData.diet_compatibility || []).forEach((d) =>
        payload.append("diet_compatibility[]", d)
      );

      await axios.put(`${Urls.dev}/api/v1/food/updateFood`, payload);

      toast.success("Food updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-white text-2xl font-extrabold mb-6">Edit Food</h1>

      <div className="bg-black/50 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label
              htmlFor="foodPic"
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/50 rounded-lg cursor-pointer hover:border-white"
            >
              {preview ? (
                <img
                  src={preview}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <MdCloudUpload className="text-6xl text-white/80 mb-1" />
                  <span className="text-white/60 text-sm">Upload Image</span>
                </>
              )}
            </label>
            <input
              type="file"
              id="foodPic"
              hidden
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />
          </div>

          {/* Basic Fields */}
          <Field label="Food Name">
            <input
              type="text"
              {...register("food_name")}
              className={inputBase}
              readOnly
            />
          </Field>

          <Field label="Description">
            <textarea
              {...register("food_description")}
              rows={3}
              className={`${inputBase} resize-y`}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Price">
              <input
                type="number"
                {...register("food_price")}
                className={inputBase}
              />
            </Field>
            <Field label="Category">
              <input
                type="text"
                {...register("food_category")}
                className={inputBase}
              />
            </Field>
            <Field label="Type">
              <input
                type="text"
                {...register("food_type")}
                className={inputBase}
              />
            </Field>
          </div>

          {/* Nutrition */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Calories">
              <input
                type="number"
                {...register("calories")}
                className={inputBase}
              />
            </Field>
            <Field label="Serving Size (g)">
              <input
                type="number"
                {...register("serving_size_g")}
                className={inputBase}
              />
            </Field>
            {["protein", "carbs", "fat", "fiber", "sugar"].map((n) => (
              <Field key={n} label={n}>
                <input type="number" {...register(n)} className={inputBase} />
              </Field>
            ))}
          </div>

          {/* Diet Compatibility */}
          <Field label="Diet Compatibility">
            <div className="relative group">
              <div className={`${inputBase} cursor-pointer select-none`}>
                {watch("diet_compatibility").length
                  ? watch("diet_compatibility").join(", ")
                  : "Select diet compatibility"}
              </div>
              <div className="absolute left-0 top-full z-30 mt-1 w-full bg-black/90 border border-white/30 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                {DIET_OPTIONS.map((d) => {
                  const selected = watch("diet_compatibility").includes(d);
                  return (
                    <div
                      key={d}
                      className="px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        const curr = watch("diet_compatibility");
                        setValue(
                          "diet_compatibility",
                          selected ? curr.filter((x) => x !== d) : [...curr, d]
                        );
                      }}
                    >
                      <input type="checkbox" checked={selected} readOnly />
                      <span className="capitalize text-white">{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>
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
          <Field label="Tags (comma separated)">
            <input
              {...register("tags")}
              className={inputBase}
              placeholder="e.g. high-protein, low-carb"
            />
          </Field>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-green-500 border border-white bg-black hover:border-black"
          >
            {loading ? "Updating..." : "Update Food"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-white font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default EditFood;

// ... existing imports ...
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import Url from "../../Utils/Url.js";
import {
  TAG_OPTIONS,
  SUITABILITY_OPTIONS,
  DIET_COMPATIBILITY,
  FOOD_CATEGORY,
  FOOD_TYPE,
} from "../../Utils/nutritions.js";
import { customStyles } from "../../Utils/customStyles.js";

const AddFood = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const HEALTH_OPTIONS = [
    { value: "suitable", label: "Suitable" },
    { value: "not_suitable", label: "Not Suitable" },
  ];

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

      // Basic info
      formData.append("food_name", data.food_name);
      formData.append("food_description", data.food_description);
      formData.append("food_price", data.food_price);
      formData.append("food_category", data.food_category?.value || "");
      formData.append("food_type", data.food_type?.value || "");

      // Macronutrients
      formData.append("calories", data.calories);
      formData.append("serving_size_g", data.serving_size_g);
      formData.append("protein", data.protein);
      formData.append("carbs", data.carbs);
      formData.append("fat", data.fat);
      formData.append("fiber", data.fiber || 0);
      formData.append("sugar", data.sugar || 0);

      // Multi-select arrays
      (data.tags || []).forEach((t) => formData.append("tags[]", t.value));
      (data.suitability || []).forEach((s) =>
        formData.append("suitability[]", s.value),
      );
      (data.diet_compatibility || []).forEach((d) =>
        formData.append("diet_compatibility[]", d.value),
      );

      // --- NEW FIELD: Ingredients ---
      (data.ingredients || []).forEach((ing) =>
      formData.append("ingredients[]", ing.value)
      );

      // --- NEW FIELD: Health Suitability ---
      formData.append(
        "health_suitability[diabetic]",
        data.diabetic?.value || "suitable",
      );
      formData.append(
        "health_suitability[high_cholesterol]",
        data.high_cholesterol?.value || "suitable",
      );
      formData.append(
        "health_suitability[hypertension]",
        data.hypertension?.value || "suitable",
      );
      formData.append(
        "health_suitability[weight_management]",
        data.weight_management?.value || "suitable",
      );

      // Send request
      const response = await axios.post(
        `${Url.dev}/api/v1/food/addFood`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
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

  const inputBase =
    "w-full px-3 py-2 rounded-md bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-white/80 transition";
  const mapToSelectOptions = (arr) =>
    arr.map((item) => ({ value: item, label: item }));

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

        {/* Food Name & Description */}
        <Field label="Food Name" error={errors.food_name}>
          <input
            {...register("food_name", { required: true })}
            className={inputBase}
          />
        </Field>
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
            <Controller
              name="food_category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={mapToSelectOptions(FOOD_CATEGORY)}
                  placeholder="Select category"
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  isClearable
                />
              )}
            />
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
          <Controller
            name="food_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={mapToSelectOptions(FOOD_TYPE)}
                placeholder="Select food type"
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isClearable
              />
            )}
          />
        </Field>

        {/* Macronutrients & Serving */}
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

        {/* Ingredients */}
        <Field label="Ingredients">
          <Controller
            className="bg-transparent"
            name="ingredients"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                isMulti
                placeholder="Enter ingredients"
                styles={{
                  ...customStyles,
                  control: (base) => ({
                    ...base,
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,0.3)",
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937", // dark dropdown (optional)
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "rgba(255,255,255,0.6)",
                  }),
                }}
              />
            )}
          />
        </Field>

        {/* Health Suitability */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Diabetic">
            <Controller
              name="diabetic"
              control={control}
              defaultValue={HEALTH_OPTIONS[0]}
              render={({ field }) => (
                <Select
                  {...field}
                  options={HEALTH_OPTIONS}
                  styles={customStyles}
                />
              )}
            />
          </Field>

          <Field label="High Cholesterol">
            <Controller
              name="high_cholesterol"
              control={control}
              defaultValue={HEALTH_OPTIONS[0]}
              render={({ field }) => (
                <Select
                  {...field}
                  options={HEALTH_OPTIONS}
                  styles={customStyles}
                />
              )}
            />
          </Field>

          <Field label="Hypertension">
            <Controller
              name="hypertension"
              control={control}
              defaultValue={HEALTH_OPTIONS[0]}
              render={({ field }) => (
                <Select
                  {...field}
                  options={HEALTH_OPTIONS}
                  styles={customStyles}
                />
              )}
            />
          </Field>

          <Field label="Weight Management">
            <Controller
              name="weight_management"
              control={control}
              defaultValue={HEALTH_OPTIONS[0]}
              render={({ field }) => (
                <Select
                  {...field}
                  options={HEALTH_OPTIONS}
                  styles={customStyles}
                />
              )}
            />
          </Field>
        </div>

        {/* Diet Compatibility */}
        <Field label="Diet Compatibility">
          <Controller
            name="diet_compatibility"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={mapToSelectOptions(DIET_COMPATIBILITY)}
                isMulti
                isClearable
                placeholder="Select diet compatibility"
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            )}
          />
        </Field>

        {/* Suitability */}
        <Field label="Suitability">
          <Controller
            name="suitability"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={mapToSelectOptions(SUITABILITY_OPTIONS)}
                isMulti
                isClearable
                placeholder="Select suitability"
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            )}
          />
        </Field>

        {/* Tags */}
        <Field label="Tags">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={mapToSelectOptions(TAG_OPTIONS)}
                isMulti
                isClearable
                placeholder="Select tags"
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            )}
          />
        </Field>

        <button
          type="submit"
          className="relative overflow-hidden mt-4 px-6 py-2 border border-green-400 text-white font-medium rounded-md
             before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-green-400 before:z-0 before:transition-all before:duration-300
             hover:before:w-full cursor-pointer hover:text-black"
        >
          <span className="relative z-10">Save Food Item</span>
        </button>
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

export default AddFood;

// ... existing imports ...
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Urls from "../../Utils/Url.js";
import {
  TAG_OPTIONS,
  SUITABILITY_OPTIONS,
  DIET_COMPATIBILITY,
  FOOD_CATEGORY,
  FOOD_TYPE,
} from "../../Utils/nutritions.js";
import { customStyles } from "../../Utils/customStyles.js";
import Button from "../../Components/Button/Button.jsx";

const inputBase =
  "w-full px-3 py-2 rounded-md bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-white/80 transition";

const healthOptions = ["suitable", "caution", "not_suitable"].map((v) => ({
  value: v,
  label: v,
}));

const EditFood = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      diet_compatibility: [],
      suitability: [],
      tags: [],
      ingredients: [],
      diabetic: false,
      high_cholesterol: "suitable",
      hypertension: "suitable",
      weight_management: "suitable",
    },
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const mapToSelectOptions = (arr) =>
    arr.map((item) => ({ value: item, label: item }));

  /* -------------------- FETCH FOOD -------------------- */
  const fetchFoodDetails = async () => {
    try {
      const response = await axios.get(`${Urls.dev}/api/v1/food/getFoodDetails`, { params: { name } });
      const data = response.data.data;
      if (!data) {
        toast.info("Food not present in database");
        return;
      }

      reset({
        ...data,
        food_category: data.food_category ? { value: data.food_category, label: data.food_category } : null,
        food_type: data.food_type ? { value: data.food_type, label: data.food_type } : null,
        diet_compatibility: (data.diet_compatibility || []).map((d) => ({ value: d, label: d })),
        suitability: (data.suitability || []).map((s) => ({ value: s, label: s })),
        tags: (data.tags || []).map((t) => ({ value: t, label: t })),
        ingredients: (data.ingredients || []).map((i) => ({ value: i, label: i })),
        diabetic: data.health_suitability?.diabetic || false,
        high_cholesterol: data.health_suitability?.high_cholesterol || "suitable",
        hypertension: data.health_suitability?.hypertension || "suitable",
        weight_management: data.health_suitability?.weight_management || "suitable",
      });

      if (data.food_image_url) setPreview(data.food_image_url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching food data");
    }
  };

  useEffect(() => {
    if (name) fetchFoodDetails();
  }, [name]);

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = {
        food_name: formData.food_name, // immutable key
        food_description: formData.food_description,
        food_price: Number(formData.food_price),
        food_category: formData.food_category?.value,
        food_type: formData.food_type?.value,
        calories: Number(formData.calories),
        serving_size_g: Number(formData.serving_size_g),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: Number(formData.fiber),
        sugar: Number(formData.sugar),
        tags: formData.tags.map((t) => t.value),
        suitability: formData.suitability.map((s) => s.value),
        diet_compatibility: formData.diet_compatibility.map((d) => d.value),
        ingredients: formData.ingredients.map((i) => i.value),
        health_suitability: {
          diabetic: formData.diabetic,
          high_cholesterol: formData.high_cholesterol,
          hypertension: formData.hypertension,
          weight_management: formData.weight_management,
        },
      };

      await axios.put(`${Urls.dev}/api/v1/food/updateFood`, payload, {
        headers: { "Content-Type": "application/json" },
      });

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
          {/* Existing Image */}
          {preview && (
            <div className="h-40 rounded-lg overflow-hidden border border-white/30">
              <img src={preview} alt="Food" className="h-full w-full object-cover" />
            </div>
          )}

          {/* Food Name */}
          <Field label="Food Name">
            <input type="text" {...register("food_name")} className={inputBase} readOnly />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea {...register("food_description")} rows={3} className={`${inputBase} resize-y`} />
          </Field>

          {/* Category & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category">
              <Controller
                name="food_category"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={mapToSelectOptions(FOOD_CATEGORY)} styles={customStyles} />
                )}
              />
            </Field>
            <Field label="Type">
              <Controller
                name="food_type"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={mapToSelectOptions(FOOD_TYPE)} styles={customStyles} />
                )}
              />
            </Field>
          </div>

          {/* Nutrition */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "food_price",
              "calories",
              "serving_size_g",
              "protein",
              "carbs",
              "fat",
              "fiber",
              "sugar",
            ].map((n) => (
              <Field key={n} label={n.replace(/_/g, " ")}>
                <input type="number" {...register(n)} className={inputBase} />
              </Field>
            ))}
          </div>

          {/* Multi Selects */}
          {[
            ["diet_compatibility", DIET_COMPATIBILITY],
            ["suitability", SUITABILITY_OPTIONS],
            ["tags", TAG_OPTIONS],
            ["ingredients", []], // Free-form ingredients
          ].map(([name, options]) => (
            <Field key={name} label={name.replace(/_/g, " ")}>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={options.length ? mapToSelectOptions(options) : undefined}
                    isMulti
                    isClearable
                    placeholder={`Select ${name}`}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>
          ))}

          {/* Health Suitability */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Diabetic">
              <input type="checkbox" {...register("diabetic")} className="mr-2" /> Yes
            </Field>
            <Field label="High Cholesterol">
              <Controller
                name="high_cholesterol"
                control={control}
                render={({ field }) => <Select {...field} options={healthOptions} styles={customStyles} />}
              />
            </Field>
            <Field label="Hypertension">
              <Controller
                name="hypertension"
                control={control}
                render={({ field }) => <Select {...field} options={healthOptions} styles={customStyles} />}
              />
            </Field>
            <Field label="Weight Management">
              <Controller
                name="weight_management"
                control={control}
                render={({ field }) => <Select {...field} options={healthOptions} styles={customStyles} />}
              />
            </Field>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-md font-bold border border-white bg-black hover:border-black"
          >
            {loading ? "Updating..." : "Update Food"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-white font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default EditFood;
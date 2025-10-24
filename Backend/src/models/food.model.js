import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    }, // e.g. "Grilled Chicken Bowl"

    food_description: {
      type: String,
      required: [true, 'description is required'],
    }, // food description

    food_price: {
      type: Number,
      required: [true, 'price is required'],
    }, // price per serving

    food_image_url: {
      type: String,
      required: [true, 'image url is requried'],
    }, // image URL or path

    food_image_public_id: {
      type: String,
      required: [true, 'image public id  is required'],
    },

    food_category: {
      type: String,
      required: [true, 'category  is required'],
    }, // e.g. "Main Course", "Snacks"

    food_type: {
      type: String,
      required: [true, 'type is required'],
    }, // e.g. "breakfast", "lunch", "dinner"

    calories: {
      type:Number,
      required: [true, "calories are required"]
    },
    serving_size_g: {
      type:Number,
      required:[true, "serving  required"]
    },
    // nutrition per serving (1 person)
    protein: {
      type: Number,
      required: [true, 'protein is required'],
    }, // grams
    carbs: {
      type: Number,
      required: [true, 'carbs are required'],
    }, // grams
    fat: {
      type: Number,
      required: [true, 'fat is required'],
    }, // grams
    fiber: {
      type: Number,
      required: true,
    }, // grams (optional)
    sugar: {
      type: Number,
      required: true,
    }, // grams (optional)

    tags: [{ type: String, required: true }], // e.g. ["high-protein", "low-carb"]
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

//write food aggregate pipelines (if needed )

const foodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema);
export default foodModel;

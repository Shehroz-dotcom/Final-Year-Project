import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // keep
    },

    food_description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    food_price: {
      type: Number,
      required: [true, 'Price is required'],
    },

    food_image_url: {
      type: String,
      required: [true, 'Image URL is required'],
    },

    food_image_public_id: {
      type: String,
      required: [true, 'Image public ID is required'],
    },

    food_category: {
      type: String,
      required: [true, 'Category is required'],
      index: true, // keep
    },

    food_type: {
      type: String,
      required: [true, 'Food type is required'],
      index: true, // keep
    },

    // Macronutrients per serving
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      index: true, // optional but kept
    },
    serving_size_g: {
      type: Number,
      required: [true, 'Serving size (g) is required'],
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
    },
    fiber: {
      type: Number,
      required: [true, 'Fiber is required'],
    },
    sugar: {
      type: Number,
      required: [true, 'Sugar is required'],
    },

    diet_compatibility: [
      {
        type: String,
        enum: [
          'omnivore',
          'vegetarian',
          'vegan',
          'keto',
          'paleo',
          'gluten-free',
        ],
        index: true, // keep
      },
    ],

    // Tags & metadata
    tags: [{ type: String, required: true, index: true }],
    suitability: [{ type: String, index: true }],

    // Computed fields
    userReviews: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewerName: {
          type: String,
          required: [true, 'UserName is required'],
        },
        date: { type: Date, default: Date.now },
        review: { type: String, required: true, trim: true },
      },
    ],

    calorie_density: {
      type: Number,
      default: function () {
        return this.serving_size_g ? this.calories / this.serving_size_g : 0;
      },
    },
    protein_ratio: {
      type: Number,
      default: function () {
        const totalCalories = this.protein * 4 + this.carbs * 4 + this.fat * 9;
        return totalCalories ? ((this.protein * 4) / totalCalories) * 100 : 0;
      },
    },
  },
  { timestamps: true }
);

const foodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema);
export default foodModel;

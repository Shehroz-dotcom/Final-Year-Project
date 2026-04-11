import mongoose from 'mongoose';
import { getEmbedding } from '../utils/NlpConfig/getEmbedding.js';
import {
  TAG_OPTIONS,
  SUITABILITY_OPTIONS,
  DIET_COMPATIBILITY,
  FOOD_CATEGORY,
  FOOD_TYPE,
} from '../utils/Nutritions/nutritions.js';

const FoodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    food_description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    food_embedding: {
      type: [Number],
      default: [],
      validate: {
        validator: function (v) {
          if (!v || v.length === 0) return true;
          return v.length === 1024;
        },
        message: 'BGE-M3 embedding must be exactly 1024 dimensions',
      },
      select: false,
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
      enum: FOOD_CATEGORY,
      required: [true, 'Category is required'],
      index: true,
    },

    food_type: {
      type: String,
      enum: FOOD_TYPE,
      required: [true, 'Food type is required'],
      index: true,
    },

    calories: { type: Number, required: true, index: true },
    serving_size_g: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },

    diet_compatibility: [
      { type: String, enum: DIET_COMPATIBILITY, index: true },
    ],

    tags: [
      {
        type: String,
        enum: TAG_OPTIONS,
        required: true,
        index: true,
      },
    ],

    suitability: [{ type: String, enum: SUITABILITY_OPTIONS, index: true }],

    userReviews: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewerName: { type: String, required: true },
        date: { type: Date, default: Date.now },
        review: { type: String, required: true, trim: true },
      },
    ],

    // -------------------------
    // FIX 1: SAFE CALC FIELDS
    // -------------------------
    calorie_density: {
      type: Number,
      default: 0,
    },

    protein_ratio: {
      type: Number,
      default: 0,
    },

    ingredients: {
      type: [String],
      default: [],
      required: true,
    },

    // -------------------------
    // FIX 2: REMOVE SILENT DEFAULT TRAP
    // -------------------------
    health_suitability: {
      diabetic: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        required: true,
      },
      high_cholesterol: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        required: true,
      },
      hypertension: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        required: true,
      },
      weight_management: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        required: true,
      },
    },
  },
  { timestamps: true }
);

// -------------------------
// FIX 3: PRE-SAVE CALCULATION (SAFE)
// -------------------------
FoodSchema.pre('save', async function (next) {
  try {
    // calorie density
    this.calorie_density = this.serving_size_g
      ? this.calories / this.serving_size_g
      : 0;

    // protein ratio
    const totalCalories = this.protein * 4 + this.carbs * 4 + this.fat * 9;

    this.protein_ratio = totalCalories
      ? ((this.protein * 4) / totalCalories) * 100
      : 0;

    // -------------------------
    // FIX 4: EMBEDDING SAFETY
    // -------------------------
    const isModified =
      this.isModified('food_name') ||
      this.isModified('food_description') ||
      this.isModified('tags') ||
      this.isModified('diet_compatibility') ||
      this.isModified('ingredients');

    if (isModified || this.isNew) {
      const contextString = `
Dish: ${this.food_name}
Category: ${this.food_category}
Diet: ${(this.diet_compatibility || []).join(', ')}
Tags: ${(this.tags || []).join(', ')}
Ingredients: ${(this.ingredients || []).join(', ')}
Health: ${JSON.stringify(this.health_suitability)}
Description: ${this.food_description}
      `.trim();

      this.food_embedding = await getEmbedding(contextString);
    }

    next();
  } catch (error) {
    console.error('Embedding Generation Error:', error);
    next(error);
  }
});

const foodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema);

export default foodModel;

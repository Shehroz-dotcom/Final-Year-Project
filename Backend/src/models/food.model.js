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

    // --- VECTOR STORAGE FIELD ---
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

    // Macronutrients
    calories: { type: Number, required: true, index: true },
    serving_size_g: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },

    // Existing arrays
    diet_compatibility: [
      { type: String, enum: DIET_COMPATIBILITY, index: true },
    ],
    tags: [{ type: String, enum: TAG_OPTIONS, required: true, index: true }],
    suitability: [{ type: String, enum: SUITABILITY_OPTIONS, index: true }],

    userReviews: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewerName: { type: String, required: true },
        date: { type: Date, default: Date.now },
        review: { type: String, required: true, trim: true },
      },
    ],

    // --- CALCULATED FIELDS ---
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

    // --- NEW FIELDS FROM ENRICHED DATA ---
    ingredients: {
      type: [String],
      default: [],
      required: true,
    },

    health_suitability: {
      diabetic: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        default: 'suitable',
      },
      high_cholesterol: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        default: 'suitable',
      },
      hypertension: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        default: 'suitable',
      },
      weight_management: {
        type: String,
        enum: ['suitable', 'not_suitable'],
        default: 'suitable',
      },
    },
  },
  { timestamps: true }
);

// --- PRE-SAVE HOOK FOR EMBEDDING GENERATION ---
FoodSchema.pre('save', async function (next) {
  const isModified =
    this.isModified('food_name') ||
    this.isModified('food_description') ||
    this.isModified('tags') ||
    this.isModified('diet_compatibility');

  if (!isModified && !this.isNew) return next();

  try {
    const contextString = `
      Dish: ${this.food_name}. 
      Category: ${this.food_category}. 
      Diet: ${this.diet_compatibility.join(', ')}. 
      Tags: ${this.tags.join(', ')}. 
      Description: ${this.food_description}
      Ingredients: ${this.ingredients.join(', ')}
      Health Suitability: ${JSON.stringify(this.health_suitability)}
    `.trim();

    this.food_embedding = await getEmbedding(contextString);
    next();
  } catch (error) {
    console.error('Embedding Generation Error:', error);
    next(error);
  }
});

const foodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema);
export default foodModel;

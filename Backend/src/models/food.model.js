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
      index: true,
    }, // e.g. "Main Course", "Snacks"

    food_type: {
      type: String,
      required: [true, 'Food type is required'],
      index: true,
    }, // e.g. "breakfast", "lunch", "dinner"

    // Macronutrients per serving
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
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

    // Diet compatibility (filters meals for users with restrictions)

    // // Allergen tracking
    // allergens: [{ type: String }], // e.g. ["nuts", "dairy", "shellfish"]

    // Micronutrients (for future expansion)
    // micronutrients: {
    //   sodium_mg: { type: Number, default: 0 },
    //   potassium_mg: { type: Number, default: 0 },
    //   iron_mg: { type: Number, default: 0 },
    // },

    // Computed fields (auto-calculated for AI logic)
    userReviews: [
      {
       
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        reviewerName: {
          type: String,
          required: [true, "UserName  is required "],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        review: {
          type: String,
          required: true,
          trim: true,
        },
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
      },
    ],

    // Tags & metadata for recommendations
    tags: [{ type: String, required: true }], // e.g. ["high-protein", "low-carb"]
    suitability: [{ type: String }], // e.g. ["post-workout", "low-calorie", "recovery"]
  },
  { timestamps: true }
);

// ⚙️ Indexing for faster filtering
FoodSchema.index({ tags: 1 });
FoodSchema.index({ food_type: 1 });
FoodSchema.index({ calories: 1 });
FoodSchema.index({ diet_compatibility: 1 });
FoodSchema.index({ suitability: 1 });

const foodModel = mongoose.models.Food || mongoose.model('Food', FoodSchema);
export default foodModel;

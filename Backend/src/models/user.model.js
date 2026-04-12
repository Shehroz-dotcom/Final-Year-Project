import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    phoneNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // 🍽️ Meal Tracking Data
    nutritionLog: [
      {
        date: { type: Date, default: Date.now },
        totalCalories: { type: Number, default: 0 },
        totalProtein: { type: Number, default: 0 },
        totalCarbs: { type: Number, default: 0 },
        totalFats: { type: Number, default: 0 },
      },
    ],

    // 🥗 BASIC DIET PREFERENCE (legacy but still useful)
    dietPreference: {
      type: String,
      enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free'],
      default: 'omnivore',
    },

    // 🧠 NEW: FULL HEALTH PROFILE (MAIN RECOMMENDATION ENGINE INPUT)
    healthProfile: {
      // more flexible diet type (future-proof vs dietPreference)
      dietType: {
        type: String,
        enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'jain'],
        default: 'omnivore',
      },

      // allergies (critical safety filter)
      allergies: [
        {
          type: String,
          enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'seafood'],
        },
      ],

      // spice preference (matches Food.spice_level)
      spiceTolerance: {
        type: String,
        enum: ['none', 'mild', 'medium', 'hot'],
        default: 'medium',
      },

      // user goals (used for ranking, NOT filtering)
      goals: [
        {
          type: String,
          enum: [
            'weight_loss',
            'muscle_gain',
            'maintenance',
            'high_protein',
            'low_carb',
          ],
        },
      ],

      // avoid preferences (matches Food.avoid_flags)
      avoid: [
        {
          type: String,
          enum: [
            'deep_fried',
            'high_sugar',
            'high_salt',
            'processed_food',
            'trans_fat',
          ],
        },
      ],
    },

    // 🧾 consumed Attributes (tracking history)
    consumedFoodAttributes: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
        },

        diet_compatibility: [String],
        tags: [String],
        suitability: [String],

        consumedAt: { type: Date, default: Date.now },
      },
    ],

    // 🔐 Auth Fields
    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// 📍 Geo index for location-based search
userSchema.index({ location: '2dsphere' });

/* -------------------------
   🔐 PASSWORD HASHING
------------------------- */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* -------------------------
   🔍 PASSWORD CHECK
------------------------- */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* -------------------------
   🔑 JWT ACCESS TOKEN
------------------------- */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

/* -------------------------
   🔑 JWT REFRESH TOKEN
------------------------- */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

/* -------------------------
   🔁 RESET PASSWORD TOKEN
------------------------- */
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};

/* -------------------------
   🍴 BASIC RECOMMENDATION (LEGACY)
   ⚠️ This is now weak but still usable
------------------------- */
userSchema.methods.getRecommendedFoods = async function () {
  const Food = mongoose.model('Food');

  return await Food.find({
    diet_compatibility: { $in: [this.dietPreference] },
  });
};

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;

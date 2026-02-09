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

    // 🥗 Dietary Preferences
    dietPreference: {
      type: String,
      enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free'],
      default: 'omnivore',
    },

    // 🧾 consumend  Attributes
    consumedFoodAttributes: [
      {
        // Optional but strongly recommended for traceability
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
        },

        // 🏷️ Classification snapshot
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

userSchema.index({ location: '2dsphere' });

// 🧂 Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 JWT Tokens
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

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// 🔁 Reset Password Token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  return resetToken;
};

// 🍴 Smart Recommendation Method
userSchema.methods.getRecommendedFoods = async function () {
  const Food = mongoose.model('Food');
  return await Food.find({
    diet_compatibility: { $in: [this.dietPreference] },
  });
};

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;

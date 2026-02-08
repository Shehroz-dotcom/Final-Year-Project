import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const cloudKitchenSchema = new mongoose.Schema(
  {
    branch_code: {
      type: String,
      required: [true, 'Branch code is required'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
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
    // 🛒 Orders array
    orders: [
      {
        order_id: { type: String, required: true },
        orderedBy:{type: String, required: true},
        items: [
          {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
          },
        ],
        totalPrice: { type: Number, required: true }, // <-- string, not number
        status: {
          type: String,
          enum: ['placed', 'cooking', 'out for delivery', 'delivered'],
          default: 'placed',
        },
        deliveryAddress: {
          type: String,
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // createdAt & updatedAt
);

// 🔑 2dsphere index for geospatial queries
cloudKitchenSchema.index({ location: '2dsphere' });

// 🔒 Encrypt password before saving
cloudKitchenSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password
cloudKitchenSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate access token
cloudKitchenSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      address: this.address,
      branch_code: this.branch_code,
    },
    process.env.CLOUDKITCHEN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.CLOUDKITCHEN_ACCESS_TOKEN_SECRET_EXPIRY, // fixed typo
    }
  );
};

// ✅ Generate refresh token
cloudKitchenSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.CLOUDKITCHEN_REFRESH_TOKEN_SECRET, // fixed typo
    {
      expiresIn: process.env.CLOUDKITCHEN_REFRESH_TOKEN_SECRET_EXPIRY,
    }
  );
};

const CloudKitchenModel =
  mongoose.models.CloudKitchen ||
  mongoose.model('CloudKitchen', cloudKitchenSchema);

export default CloudKitchenModel;

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

    orderHistory: [
      {
        items: [
          {
            cartData: {
              food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true,
              },
              priceAtPurchase: Number,
              quantity: Number,
              calories: Number,
            },
          },
        ],
        totalPrice: Number,
        orderDate: Date,
      },
    ],
    cartData: [
      {
        food: { type: Schema.Types.ObjectId, ref: 'Food' },
        quantity: { type: Number, default: 1 },
        note: { type: String },
      },
    ],

    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

//dont  user callback function as () => {}  in this have the current context that on which we want to run the encryption or any other functon
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 min
  return resetToken;
};

const userModel = mongoose.model.user || mongoose.model('User', userSchema);
export default userModel;
//add a review writing functionality  in food model

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },

  address: {
    type: String,
    required: [true, 'Address is required'],
  },

  status: {
    type: String,
    default: 'Food Processing',
  },

  date: {
    type: Date,
    default: Date.now, // ✅ Function reference, not `Date.Now()`
  },

  payment: {
    type: Boolean,
    default: false,
  },
});

// ✅ Correct way to avoid model overwrite error in dev environments
const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

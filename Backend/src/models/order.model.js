import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
      foodName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        // price per single dish at order time
        type: Number,
        required: true,
      },
      total: {
        // price * quantity
        type: Number,
        required: true,
      },
    },
  ],

  amount: {
    type: Number,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: 'Food Processing',
  },

  payment: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Correct way to avoid model overwrite error in dev environments
const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

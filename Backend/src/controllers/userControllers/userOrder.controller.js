import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import userModel from '../../models/user.model.js';
import foodModel from '../../models/food.model.js';

const userOrder = async (req, res) => {
  try {
    // 🔐 Extract JWT token
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized — no access token' });
    }

    // 🧠 Decode token to extract user ID
    const decoded = JwtDecode(token);
    const userId = decoded._id;

    // 🛒 Extract order data
    const { cart, totalPrice, totalCalories } = req.body;

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ message: 'Cart data missing' });
    }

    // 👤 Verify user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 📦 Construct order items
    const orderEntries = [];
    for (const [foodId, quantity] of Object.entries(cart)) {
      const foodItem = await foodModel.findById(foodId);
      if (!foodItem) continue;

      orderEntries.push({
        cartData: {
          food: foodItem._id,
          priceAtPurchase: foodItem.food_price,
          quantity,
          date: new Date(),
        },
      });
    }

    if (orderEntries.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid food items found in cart' });
    }

    // 🧾 Append new order
    user.orderHistory.push({
      items: orderEntries,
      totalPrice,
      totalCalories,
      orderDate: new Date(),
    });

    await user.save();

    // ✅ Response
    res.status(200).json({
      message: '✅ Order saved successfully',
      orderCount: orderEntries.length,
      totalPrice,
      totalCalories,
      orderHistory: user.orderHistory,
    });
  } catch (error) {
    console.error('❌ Error saving order:', error);
    res.status(500).json({
      message: 'Server error while saving order',
      error: error.message,
    });
  }
};

export { userOrder };

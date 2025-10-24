import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import userModel from '../../models/user.model.js';
import foodModel from '../../models/food.model.js';

const userOrder = async (req, res) => {
  try {
    // 🔐 Get JWT token from cookies
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized — no access token' });
    }

    // 🧠 Decode token to extract user ID
    const decoded = JwtDecode(token);
    const userId = decoded._id;

    // 🛒 Extract cart data and total price from request body
    const cart = req.body.cart; // cart is an object { foodId: quantity }
    const totalPrice = req.body.totalPrice;
    

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ message: 'Cart data missing' });
    }

    // 👤 Find the user FIRST
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 📦 Prepare order data by fetching prices from the Food model
    const orderEntries = [];

    for (const [foodId, quantity] of Object.entries(cart)) {
      const foodItem = await foodModel.findById(foodId);
      if (!foodItem) continue;

      orderEntries.push({
        cartData: {
          food: foodItem._id,
          priceAtPurchase: foodItem.food_price,
          quantity: quantity,
          date: new Date(),
        },
      });
    }

    if (orderEntries.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid food items found in cart' });
    }

    // 🧾 Append new order to history
    user.orderHistory.push({
      items: orderEntries,
      totalPrice: totalPrice,
      orderDate: new Date(),
    });

    // 💾 Save updated user data
    await user.save();

    // ✅ Respond success
    res.status(200).json({
      message: '✅ Order saved successfully',
      orderCount: orderEntries.length,
      totalPrice: totalPrice,
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

import OrderModel from '../../models/order.model.js';
import foodModel from '../../models/food.model.js';
import userModel from '../../models/user.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const PlaceOrder = async (req, res) => {
  try {
    const { cart, totalPrice } = req.body;
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized — no access token' });
    }

    const decodedToken = JwtDecode(token);
    const user = await userModel.findById(decodedToken._id);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized — user does not exist' });
    }

    const delivery_address = user.address;
    const name = user.fullName;

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Convert cart object to array and ensure quantities are numbers
    const cartArray = Object.entries(cart).map(([foodId, quantity]) => ({
      foodId,
      quantity: Number(quantity),
    }));

    const foodIds = cartArray.map((item) => item.foodId);
    const foods = await foodModel.find({ _id: { $in: foodIds } });

    if (foods.length !== cartArray.length) {
      return res.status(400).json({ message: 'Invalid food item in cart' });
    }

    let calculatedTotal = 0;

    // Build order items safely
    const items = cartArray.map((cartItem) => {
      const food = foods.find((f) => f._id.toString() === cartItem.foodId);

      if (!food) {
        throw new Error(`Food not found for ID: ${cartItem.foodId}`);
      }

      const quantity = Number(cartItem.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for food ID: ${cartItem.foodId}`);
      }

      const price = Number(food.food_price);
      if (isNaN(price)) {
        throw new Error(`Invalid price for food ID: ${cartItem.foodId}`);
      }

      const itemTotal = price * quantity;
      calculatedTotal += itemTotal;

      return {
        foodId: food._id,
        foodName: food.food_name,
        quantity,
        price,
        total: itemTotal,
      };
    });

    // Safe floating-point comparison
    if (Math.abs(Number(totalPrice) - calculatedTotal) > 0.01) {
      return res.status(400).json({
        message: 'Price mismatch. Please refresh cart.',
        calculatedTotal,
      });
    }

    // Create and save order
    const order = new OrderModel({
      name,
      address: delivery_address,
      items,
      amount: calculatedTotal,
    });

    await order.save();

    // Return success + clearCart signal
    return res.status(201).json({
      success: true,
      order,
      clearCart: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Order placement failed',
      error: error.message,
    });
  }
};

export { PlaceOrder };
//handle payment issues

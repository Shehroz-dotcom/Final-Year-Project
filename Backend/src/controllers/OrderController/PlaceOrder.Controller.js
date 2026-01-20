import foodModel from '../../models/food.model.js';
import userModel from '../../models/user.model.js';
import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { log } from 'console';

const PlaceOrder = async (req, res) => {
  try {
    const { cart, totalPrice } = req.body;

    // Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart must be a non-empty array',
      });
    }

    /* -------------------- Auth -------------------- */
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = JwtDecode(token);
    const userId = decoded?._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    /* -------------------- User -------------------- */
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    /* -------------------- Location -------------------- */
    const userCoordinates = user.location?.coordinates;
    if (!Array.isArray(userCoordinates) || userCoordinates.length !== 2) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user location' });
    }

    /* -------------------- User Address -------------------- */
    if (!user.address || typeof user.address !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User delivery address not found',
      });
    }

    /* -------------------- Fetch food items -------------------- */
    const foodIds = cart
      .map((item) => item.foodId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const foodItems = await foodModel.find({ _id: { $in: foodIds } });

    if (!foodItems.length) {
      return res
        .status(400)
        .json({ success: false, message: 'No valid food items found' });
    }

    /* -------------------- Find nearest kitchen -------------------- */
    const nearestKitchen = await CloudKitchenModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userCoordinates,
          },
        },
      },
    });

    if (!nearestKitchen) {
      return res.status(404).json({
        success: false,
        message: 'No nearby cloud kitchen found',
      });
    }

    /* -------------------- Build order -------------------- */
    const orderItems = cart
      .map((cartItem) => {
        const food = foodItems.find(
          (f) => f._id.toString() === cartItem.foodId.toString()
        );
        if (!food) {
          console.warn(
            `Food not found for cartItem.foodId = ${cartItem.foodId}`
          );
          return null; // skip invalid item
        }

        // Use food_name variable instead of food.name
        const food_name = food.food_name; // assign from DB

        if (!food_name) {
          console.warn(`Food name missing for ID: ${food._id}`);
          return null;
        }

        return {
          name: food_name,
          quantity: Number(cartItem.quantity) || 1,
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart contains invalid food items',
      });
    }

    const order = {
      order_id: crypto.randomUUID(),
      items: orderItems,
      totalPrice: Number(totalPrice) || 0,
      deliveryAddress: user.address, // ✅ pulled from user profile
      status: 'placed',
      createdAt: new Date(),
    };

    /* -------------------- Dispatch order -------------------- */
    nearestKitchen.orders.push(order);
    await nearestKitchen.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed and dispatched to nearest kitchen',
      order: order.order_id
    });
    console.log(order_id);
    
  } catch (error) {
    console.error('PlaceOrder ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { PlaceOrder };

import foodModel from '../../models/food.model.js';
import userModel from '../../models/user.model.js';
import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

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

    const decoded = JwtDecode(token, process.env.ACCESS_TOKEN_SECRET);
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

    const userFullName = user.fullName || 'Unknown'; // <-- use fullName

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
    const nearestKitchen = await CloudKitchenModel.findOne(
      {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: userCoordinates,
            },
          },
        },
      },
      { branch_code: 1, orders: 1 }
    );

    if (!nearestKitchen) {
      return res.status(404).json({
        success: false,
        message: 'No nearby cloud kitchen found',
      });
    }

    const branchCode = nearestKitchen.branch_code;

    if (!branchCode) {
      return res.status(500).json({
        success: false,
        message: 'Nearest kitchen branch code missing',
      });
    }

    /* -------------------- Build order -------------------- */
    const orderItems = cart
      .map((cartItem) => {
        const food = foodItems.find(
          (f) => f._id.toString() === cartItem.foodId.toString()
        );
        if (!food) return null;

        const food_name = food.food_name;
        if (!food_name) return null;

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
      orderedBy: userFullName, // <-- store user's fullName here
      items: orderItems,
      totalPrice: Number(totalPrice) || 0,
      deliveryAddress: user.address,
      status: 'placed',
      createdAt: new Date(),
    };

    /* -------------------- Dispatch order -------------------- */
    nearestKitchen.orders.push(order);
    await nearestKitchen.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed and dispatched to nearest kitchen',
      order: order.order_id,
      branchCode: branchCode,
    });
  } catch (error) {
    console.error('PlaceOrder ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { PlaceOrder };

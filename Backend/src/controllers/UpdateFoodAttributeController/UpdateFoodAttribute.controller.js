import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import userModel from '../../models/user.model.js';
import foodModel from '../../models/food.model.js';
import {
  TAG_OPTIONS,
  SUITABILITY_OPTIONS,
  DIET_COMPATIBILITY,
} from '../../utils/Nutritions/nutritions.js';
import mongoose from 'mongoose';

const MAX_CONSUMED = 30; // max items to keep

const UpdateFoodAttribute = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart must be a non-empty array',
      });
    }

    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = JwtDecode(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const foodIds = cart.map((item) => item.foodId);
    const foods = await foodModel.find({ _id: { $in: foodIds } });

    const existingFoodIds = new Set(
      (user.consumedFoodAttributes || []).map((entry) => entry.food.toString())
    );

    const snapshots = [];

    for (const item of cart) {
      if (existingFoodIds.has(item.foodId)) continue;

      const food = foods.find((f) => f._id.toString() === item.foodId);
      if (!food) continue;

      // Deduplicate each attribute array
      const dietCompatibility = [
        ...new Set(
          food.diet_compatibility.filter((dc) =>
            DIET_COMPATIBILITY.includes(dc)
          )
        ),
      ];

      const tags = [
        ...new Set(food.tags.filter((tag) => TAG_OPTIONS.includes(tag))),
      ];

      const suitability = [
        ...new Set(
          food.suitability.filter((su) => SUITABILITY_OPTIONS.includes(su))
        ),
      ];

      snapshots.push({
        food: food._id,
        diet_compatibility: dietCompatibility,
        tags,
        suitability,
        consumedAt: new Date(),
      });
    }

    if (snapshots.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new food attributes to add',
      });
    }

    // Push snapshots and keep only the last MAX_CONSUMED items
    await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          consumedFoodAttributes: {
            $each: snapshots,
            $slice: -MAX_CONSUMED,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      addedCount: snapshots.length,
      message: 'Food attributes saved successfully',
    });
  } catch (error) {
    console.error('UpdateFoodAttribute error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export { UpdateFoodAttribute };

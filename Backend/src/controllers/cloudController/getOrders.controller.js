import mongoose from 'mongoose';
import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const getOrders = async (req, res) => {
  try {
    const token = req.cookies?.cloudAccessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing',
      });
    }

    let decoded;
    try {
      decoded = JwtDecode(token, process.env.CLOUDKITCHEN_ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    if (!decoded?._id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    const kitchenId = new mongoose.Types.ObjectId(decoded._id);

    // 🔥 Filter out delivered orders directly in MongoDB
    const result = await CloudKitchenModel.aggregate([
      {
        $match: { _id: kitchenId },
      },
      {
        $project: {
          branch_code: 1,
          address: 1,
          orders: {
            $filter: {
              input: '$orders',
              as: 'order',
              cond: { $ne: ['$$order.status', 'delivered'] },
            },
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen not found',
      });
    }

    const kitchen = result[0];

    return res.status(200).json({
      success: true,
      orders: kitchen.orders,
      kitchen: {
        branch_code: kitchen.branch_code,
        address: kitchen.address,
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export { getOrders };

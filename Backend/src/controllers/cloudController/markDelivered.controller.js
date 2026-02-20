import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const markDelivered = async (req, res) => {
  try {
    const { orderId, branchCode } = req.params;

    if (!orderId || !branchCode) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Branch Code are required',
      });
    }

    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const decoded = JwtDecode(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded?._id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // 🔎 Find kitchen + update order in one query
    const updatedKitchen = await CloudKitchenModel.findOneAndUpdate(
      {
        branch_code: branchCode,
        'orders.order_id': orderId,
      },
      {
        $set: { 'orders.$.status': 'delivered' },
      },
      { new: true }
    );

    if (!updatedKitchen) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen or Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order delivered Successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export { markDelivered };

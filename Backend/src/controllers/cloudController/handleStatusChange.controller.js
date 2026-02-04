import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const handleStatusChange = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'orderId and status are required',
      });
    }

    const token = req.cookies.cloudAccessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const decoded = JwtDecode(
      token,
      process.env.CLOUDKITCHEN_ACCESS_TOKEN_SECRET
    );

    const kitchenId = decoded._id;

    // 🔥 core update logic
    const updatedKitchen = await CloudKitchenModel.findOneAndUpdate(
      {
        _id: kitchenId,
        'orders.order_id': orderId,
      },
      {
        $set: {
          'orders.$.status': status,
        },
      },
      { new: true }
    );

    if (!updatedKitchen) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { handleStatusChange };

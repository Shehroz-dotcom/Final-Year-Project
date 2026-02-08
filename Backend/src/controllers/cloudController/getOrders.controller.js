import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const getOrders = async (req, res) => {
  try {
    const token = req.cookies.cloudAccessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing',
      });
    }

    const decoded = JwtDecode(
      token,
      process.env.CLOUDKITCHEN_ACCESS_TOKEN_SECRET
    );

    const kitchenId = decoded._id;

    const kitchen = await CloudKitchenModel.findById(kitchenId).select(
      'orders branch_code address'
    );

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen not found',
      });
    }

    return res.status(200).json({
      success: true,
      orders: kitchen.orders,
      kitchen: {
        branch_code: kitchen.branch_code,
        address: kitchen.address,
      },
    });
  } catch (error) {
    console.error('get orders error:', error.message);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export { getOrders };

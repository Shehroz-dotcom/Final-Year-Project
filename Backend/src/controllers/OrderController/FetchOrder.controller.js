import CloudKitchenModel from '../../models/cloudKitchen.model.js';

const FetchOrder = async (req, res) => {
  try {
    const { orderId, branchCode } = req.params;

    if (!orderId || !branchCode) {
      return res.status(400).json({
        success: false,
        message: 'orderId and branchCode are required',
      });
    }

    // 1️⃣ Find cloud kitchen by branch_code
    const kitchen = await CloudKitchenModel.findOne(
      { branch_code: branchCode },
      { orders: 1 } // only fetch orders
    );

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: 'Cloud kitchen not found',
      });
    }

    // 2️⃣ Find order inside orders array
    const order = kitchen.orders.find((o) => o.order_id === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // 3️⃣ Return order
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('from fetch order controller', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { FetchOrder };

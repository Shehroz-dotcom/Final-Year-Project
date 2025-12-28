import OrderModel from '../../models/order.model.js';
const FetchAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
}
};

export { FetchAllOrders };

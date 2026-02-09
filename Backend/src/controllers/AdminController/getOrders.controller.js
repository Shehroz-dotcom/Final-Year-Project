import CloudKitchenModel from '../../models/cloudKitchen.model.js';

const getOrders = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    // Find the kitchen by ID
    const kitchen = await CloudKitchenModel.findById(kitchenId);

    if (!kitchen) {
      return res.status(404).json({ message: 'Kitchen not found', orders: [], branchCode: null });
    }

    // Reverse the orders without modifying the original array
    const reversedOrders = kitchen.orders.slice().reverse();

    res.status(200).json({
      branchCode: kitchen.branch_code || null,
      orders: reversedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', orders: [], branchCode: null });
  }
};

export { getOrders };

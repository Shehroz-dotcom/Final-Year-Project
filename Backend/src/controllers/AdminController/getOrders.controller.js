import CloudKitchenModel from '../../models/cloudKitchen.model.js';

const getOrders = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    // Find the kitchen by ID
    const kitchen = await CloudKitchenModel.findById(kitchenId);

    if (!kitchen) {
      return res.status(404).json({ message: 'Kitchen not found', orders: [] });
    }

    // Send back the orders array
    res.status(200).json({ orders: kitchen.orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', orders: [] });
  }
};

export { getOrders };

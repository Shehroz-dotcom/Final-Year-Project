import foodModel from '../../models/food.model.js';

const listFood = async (req, res) => {
  try {
    const foodList = await foodModel.find({});

    if (!foodList || foodList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Database is empty, no food items found',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food list fetched',
      data: foodList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { listFood };

import foodModel from '../../models/food.model.js';
const getFoodDetails = async (req, res) => {
  const {  name } = req.query; // ✅ from route parameter

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'foodName is required',
    });
  }

  const getFood = await foodModel.findOne({ food_name: name });

  if (!getFood) {
    return res.status(404).json({
      success: false,
      message: 'Food does not exist in database backend',
    });
  }
  console.log(getFood);
  

  return res.status(200).json({
    success: true,
    message: 'Food details fetched successfully',
    data: getFood,
  });
};

export {getFoodDetails}
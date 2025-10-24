import foodModel from "../../models/food.model.js";
const updateFood = async (req, res) => {
  try {
    const {
      _id,
      food_name,
      food_description,
      food_price,
      food_image_url,
      food_image_public_id,
      food_category,
      food_type,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      tags,
    } = req.body;
  
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "_id is required to update food",
      });
    }

  
    const updatedFood = await foodModel.findByIdAndUpdate(
      _id,
      {
        food_name,
        food_description, 
        food_price,
        food_image_url,
        food_image_public_id,
        food_category,
        food_type,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        tags,
      },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating food",
      error: error.message,
    });
  }
};

export {updateFood}
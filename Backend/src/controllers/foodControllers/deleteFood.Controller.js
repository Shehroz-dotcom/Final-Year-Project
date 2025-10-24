import foodModel from '../../models/food.model.js';
import deleteFromCloudinary from '../../utils/Cloudinary/deleteCloudinary.js';

const deleteFood = async (req, res) => {
  try {
    const { foodName, publicId: deleteImageId } = req.body;

    if (!foodName || !deleteImageId) {
      return res.status(400).json({
        success: false,
        message: 'foodName and publicId are required',
      });
    }

    // find the food item you want to delete
    const deletedFood = await foodModel.findOneAndDelete({
      food_name: foodName,
    });

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    //delete image from cloudinary
    const deletedFromCloudinary = await deleteFromCloudinary(deleteImageId);

    if (!deletedFromCloudinary) {
      return res.status(500).json({
        success: false,
        message: 'Image not deleted from Cloudinary',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
      food: deletedFood, // return deleted doc if you want
    });
  } catch (error) {
    console.error('Error in deleting food:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export { deleteFood };

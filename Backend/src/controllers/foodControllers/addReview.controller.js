import foodModel from '../../models/food.model.js';

const addReview = async (req, res) => {
  try {
    
    
    const { foodId, rating, review, userName } = req.body;

    // Validate required fields
    if (!foodId || !rating || !review || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Find the food item
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }


    // Build new review object
    const newReview = {
      rating: Number(rating),
      reviewerName: String(userName),
      review,
      date: new Date(),
    };

    // Push into userReviews array
    food.userReviews.push(newReview);

    // Save food document
    await food.save();

    return res.status(200).json({
      success: true,
      message: 'Review added successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export default addReview;

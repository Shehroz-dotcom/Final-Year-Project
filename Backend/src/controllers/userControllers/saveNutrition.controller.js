import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';
import userModel from '../../models/user.model.js';
import foodModel from '../../models/food.model.js';
const saveNutrition = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .json({ message: 'Unauthorized - no access token' });

    const decoded = JwtDecode(token , process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User does not exist' });

    const { cartItems } = req.body;

    // Get only the foods that are in the cart
    ///extract all ids from cartItems and save them in foodIds
    //use foodIds to stract foods with the matching ids and save them in foodItems
    const foodIds = Object.keys(cartItems);
    const foodItems = await foodModel.find({ _id: { $in: foodIds } });

    // Initialize totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    // Compute totals
    for (const food of foodItems) {
      const quantity = cartItems[food._id.toString()] || 0;
      totalCalories += food.calories * quantity;
      totalProtein += food.protein * quantity;
      totalCarbs += food.carbs * quantity;
      totalFats += food.fat * quantity;
    }

    // Push new nutrition log entry
    user.nutritionLog.push({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      date: new Date(),
    });

    await user.save();

    res
      .status(200)
      .json({ success: true, nutrition: user.nutritionLog.slice(-1)[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export {saveNutrition}
import foodModel from '../../models/food.model.js';
import userModel from '../../models/user.model.js';
import { JwtDecode } from '../../utils/JwtDecode/JwtDecode.js';

const Recommendation = async (req, res) => {
  try {
    // -------------------------
    // 1. AUTH
    // -------------------------
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = JwtDecode(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    // -------------------------
    // 2. GET USER
    // -------------------------
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { healthProfile, consumedFoodAttributes = [] } = user;

    // -------------------------
    // 3. BUILD USER SIGNALS
    // -------------------------
    const consumedTags = new Set();
    const consumedSuitability = new Set();
    const consumedDiet = new Set();

    consumedFoodAttributes.forEach((attr) => {
      attr.tags?.forEach((t) => consumedTags.add(t));
      attr.suitability?.forEach((s) => consumedSuitability.add(s));
      attr.diet_compatibility?.forEach((d) => consumedDiet.add(d));
    });

    // -------------------------
    // 4. FETCH FOOD (broad, not strict)
    // -------------------------
    const foods = await foodModel.find({
      diet_compatibility: {
        $in: [healthProfile.dietType, ...consumedDiet],
      },
    });

    // -------------------------
    // 5. FILTER (SAFETY)
    // -------------------------
    const safeFoods = foods.filter((food) => {
      // ❌ Allergy check (FIXED version)
      if (
        healthProfile.allergies?.some((allergy) =>
          food.ingredients?.some((ing) =>
            ing.toLowerCase().includes(allergy.toLowerCase())
          )
        )
      ) {
        return false;
      }

      // ❌ Avoid flags
      if (healthProfile.avoid?.some((avoid) => food.tags?.includes(avoid))) {
        return false;
      }

      return true;
    });

    // -------------------------
    // 6. MATCH + SCORE
    // -------------------------
    const scoredFoods = safeFoods.map((food) => {
      let score = 0;

      // behavior match
      if (food.tags?.some((t) => consumedTags.has(t))) score += 3;
      if (food.suitability?.some((s) => consumedSuitability.has(s))) score += 2;
      if (food.diet_compatibility?.some((d) => consumedDiet.has(d))) score += 2;

      // goals
      if (healthProfile.goals?.includes('high_protein')) {
        score += food.protein_ratio * 0.2;
      }

      if (healthProfile.goals?.includes('weight_loss')) {
        score -= food.calorie_density * 2;
      }

      if (healthProfile.goals?.includes('low_carb')) {
        score -= food.carbs * 0.1;
      }

      // spice
      if (food.tags?.includes(healthProfile.spiceTolerance)) {
        score += 1;
      }

      return { food, score };
    });

    // -------------------------
    // 7. SORT + LIMIT
    // -------------------------
    const recommendations = scoredFoods
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((item) => item.food);

    // -------------------------
    // 8. RESPONSE
    // -------------------------
    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.error('Recommendation Error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export { Recommendation };

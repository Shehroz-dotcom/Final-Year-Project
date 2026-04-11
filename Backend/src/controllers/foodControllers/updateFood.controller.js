import foodModel from '../../models/food.model.js';

const updateFood = async (req, res) => {
  try {
    const {
      food_name,
      food_description,
      food_price,
      food_category,
      food_type,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      serving_size_g,
      calories,
      tags,
      suitability,
      diet_compatibility,
      health_suitability,
    } = req.body || {};

    /* -------------------- VALIDATION -------------------- */
    if (!food_name) {
      return res.status(400).json({
        success: false,
        message: 'food_name is required to update food',
      });
    }

    /* -------------------- HELPERS -------------------- */
    const toNumber = (v) =>
      typeof v === 'number' && !isNaN(v) ? v : Number(v) || 0;

    const safeArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;

      try {
        return JSON.parse(val);
      } catch {
        return typeof val === 'string' ? [val] : [];
      }
    };

    const safeObject = (val) => {
      if (!val) return undefined;
      if (typeof val === 'object') return val;

      try {
        return JSON.parse(val);
      } catch {
        return undefined;
      }
    };

    /* -------------------- NORMALIZATION -------------------- */
    const proteinNum = toNumber(protein);
    const carbsNum = toNumber(carbs);
    const fatNum = toNumber(fat);
    const caloriesNum = toNumber(calories);
    const servingSizeNum = toNumber(serving_size_g);

    const tagsArr = safeArray(tags);
    const suitabilityArr = safeArray(suitability);
    const dietArr = safeArray(diet_compatibility);

    const healthObj = safeObject(health_suitability);

    /* -------------------- COMPUTED FIELDS -------------------- */
    const totalCalories = proteinNum * 4 + carbsNum * 4 + fatNum * 9;

    const calorie_density = servingSizeNum ? caloriesNum / servingSizeNum : 0;

    const protein_ratio = totalCalories
      ? ((proteinNum * 4) / totalCalories) * 100
      : 0;

    /* -------------------- UPDATE -------------------- */
    const updatedFood = await foodModel.findOneAndUpdate(
      { food_name },
      {
        food_description,
        food_price: toNumber(food_price),
        food_category,
        food_type,

        protein: proteinNum,
        carbs: carbsNum,
        fat: fatNum,
        fiber: toNumber(fiber),
        sugar: toNumber(sugar),
        serving_size_g: servingSizeNum,
        calories: caloriesNum,

        tags: tagsArr,
        suitability: suitabilityArr,
        diet_compatibility: dietArr,

        health_suitability: healthObj,

        calorie_density,
        protein_ratio,
      },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: 'Food not found with this name',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      data: updatedFood,
    });
  } catch (error) {
    console.error('Update Food Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating food',
      error: error.message,
    });
  }
};

export { updateFood };

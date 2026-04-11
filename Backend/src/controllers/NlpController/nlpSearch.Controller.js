import foodModel from '../../models/food.model.js';
import { getEmbedding } from '../../utils/NlpConfig/getEmbedding.js';

// 🔹 Intent Detection
const normalizeQueryIntent = (query) => {
  const q = query.toLowerCase();

  return {
    weightLoss: /weight loss|lose weight|fat loss|cut|shred/.test(q),
    weightGain: /weight gain|bulk|bulking|mass gain/.test(q),

    highProtein: /high protein|protein rich|gym|muscle/.test(q),
    lowProtein: /low protein/.test(q),

    lowCarb: /low carb|keto/.test(q),
    highCarb: /high carb|carb load/.test(q),

    lowCalorie: /low calorie|low cal/.test(q),
    highCalorie: /high calorie|calorie dense/.test(q),

    diabetic: /diabetic|diabetes|low sugar/.test(q),
    cholesterol: /cholesterol|heart/.test(q),
    hypertension: /bp|blood pressure|hypertension|low sodium/.test(q),
  };
};

// 🔹 Expand Intent
const expandIntent = (intent) => {
  if (intent.weightLoss) {
    intent.lowCalorie = true;
    intent.highProtein = true;
  }

  if (intent.weightGain) {
    intent.highCalorie = true;
    intent.highCarb = true;
  }

  if (intent.highProtein) {
    intent.gym = true;
  }

  return intent;
};

// 🔹 Utils
const inRange = (val, min, max) => val >= min && val <= max;

const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

const matchArrayScore = (arr = [], query = '') => {
  return arr.some((item) => query.includes(item.toLowerCase())) ? 1 : 0;
};

// 🔹 STRICT CHECK
const isSuitable = (value) => value && value.toLowerCase() === 'suitable';

// 🔹 Weights
const WEIGHTS = {
  semantic: 0.6,
  nutrition: 0.4,
};

const nlpSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const lowerQuery = query.toLowerCase();

    // 🔹 Intent
    let intent = normalizeQueryIntent(query);
    intent = expandIntent(intent);

    console.log('\n🧠 INTENT:', intent);

    // 🔹 Embedding
    const queryEmbedding = await getEmbedding(query);

    if (!queryEmbedding || queryEmbedding.length !== 1024) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate query embedding',
      });
    }

    // 🔹 Fetch foods
    const foods = await foodModel
      .find({ food_embedding: { $exists: true, $ne: [] } })
      .select(
        'food_name food_description food_category food_price food_image_url food_embedding protein carbs fat calories serving_size_g calorie_density protein_ratio tags diet_compatibility suitability health_suitability'
      )
      .lean();

    // =====================================================
    // 🔥 DEBUG: RAW DATA
    // =====================================================
    console.log('\n🔍 RAW FOOD DATA (DIABETIC CHECK)');
    foods.forEach((f) => {
      console.log({
        name: f.food_name,
        diabetic: f.health_suitability?.diabetic,
      });
    });

    // =====================================================
    // 🔥 STEP 1: HARD FILTER
    // =====================================================

    let filteredFoods = foods.filter((food) => {
      const diabeticStatus = food.health_suitability?.diabetic;
      const cholesterolStatus = food.health_suitability?.high_cholesterol;
      const hypertensionStatus = food.health_suitability?.hypertension;

      console.log('\n🧪 CHECKING:', food.food_name);
      console.log({
        diabeticStatus,
        cholesterolStatus,
        hypertensionStatus,
      });

      if (intent.diabetic && !isSuitable(diabeticStatus)) {
        console.log('❌ REMOVED (DIABETIC):', food.food_name);
        return false;
      }

      if (intent.cholesterol && !isSuitable(cholesterolStatus)) {
        console.log('❌ REMOVED (CHOLESTEROL):', food.food_name);
        return false;
      }

      if (intent.hypertension && !isSuitable(hypertensionStatus)) {
        console.log('❌ REMOVED (HYPERTENSION):', food.food_name);
        return false;
      }

      console.log('✅ PASSED:', food.food_name);
      return true;
    });

    // 🔴 NO FALLBACK (CRITICAL)
    if (filteredFoods.length === 0) {
      console.log('🚫 NO SAFE FOODS FOUND');

      return res.status(200).json({
        success: true,
        query,
        intent,
        results: [],
        message: 'No foods match the health criteria',
      });
    }

    console.log('\n✅ FILTERED FOODS:');
    filteredFoods.forEach((f) => console.log(f.food_name));

    // =====================================================
    // 🔥 STEP 2: SCORING
    // =====================================================

    let rankedFoods = filteredFoods.map((food) => {
      const semanticScore = cosineSimilarity(
        queryEmbedding,
        food.food_embedding
      );

      let nutritionScore = 0;

      if (intent.weightLoss) {
        if (food.calorie_density < 1.5) nutritionScore += 0.4;
        if (food.protein_ratio > 25) nutritionScore += 0.4;
      }

      if (intent.weightGain) {
        if (food.calories > 500) nutritionScore += 0.4;
        if (food.carbs > 40) nutritionScore += 0.3;
      }

      if (intent.highProtein && food.protein_ratio > 25) {
        nutritionScore += 0.5;
      }

      if (intent.lowProtein && food.protein_ratio < 10) {
        nutritionScore += 0.3;
      }

      if (intent.lowCarb && inRange(food.carbs, 0, 15)) {
        nutritionScore += 0.5;
      }

      if (intent.highCarb && food.carbs > 40) {
        nutritionScore += 0.4;
      }

      if (intent.lowCalorie && food.calories < 400) {
        nutritionScore += 0.4;
      }

      if (intent.highCalorie && food.calories > 600) {
        nutritionScore += 0.4;
      }

      nutritionScore += matchArrayScore(food.tags, lowerQuery) * 0.3;
      nutritionScore +=
        matchArrayScore(food.diet_compatibility, lowerQuery) * 0.3;

      const score =
        semanticScore * WEIGHTS.semantic + nutritionScore * WEIGHTS.nutrition;

      return {
        ...food,
        score,
      };
    });

    // 🔹 Sort
    rankedFoods.sort((a, b) => b.score - a.score);

    console.log('\n🏆 TOP SCORES:');
    rankedFoods.slice(0, 5).forEach((f) => {
      console.log({
        name: f.food_name,
        score: f.score,
      });
    });

    // 🔹 Top 3 only (no threshold issues)
    const finalResults = rankedFoods.slice(0, 2);

    console.log('\n🎯 FINAL RESULTS:');
    finalResults.forEach((f) => console.log(f.food_name));

    // 🔹 Response
    res.status(200).json({
      success: true,
      query,
      intent,
      results: finalResults.map((f) => ({
        id: f._id,
        food_name: f.food_name,
        food_description: f.food_description,
        food_category: f.food_category,
        food_price: f.food_price,
        food_image_url: f.food_image_url,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        calories: f.calories,
        serving_size_g: f.serving_size_g,
        score: f.score.toFixed(3),
      })),
    });
  } catch (error) {
    console.error('NLP Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during NLP search',
    });
  }
};

export { nlpSearch };

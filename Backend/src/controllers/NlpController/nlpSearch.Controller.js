import foodModel from '../../models/food.model.js';
import { getEmbedding } from '../../utils/NlpConfig/getEmbedding.js';

const nlpSearch = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Received search query:', query);

    if (!query || query.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Search query is required' });
    }

    // Step 1: generate embedding for the query
    const queryEmbedding = await getEmbedding(query);

    if (!queryEmbedding || queryEmbedding.length !== 1024) {
      return res
        .status(500)
        .json({
          success: false,
          message: 'Failed to generate query embedding',
        });
    }

    // Step 2: fetch all foods with embeddings
    const foods = await foodModel
      .find({ food_embedding: { $exists: true, $ne: [] } })
      .select(
        'food_name food_description food_category food_price food_image_url food_embedding protein calories serving_size_g tags diet_compatibility suitability'
      )
      .lean();

    // Step 3: cosine similarity
    const cosineSimilarity = (vecA, vecB) => {
      const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    };

    // Step 4: rank by similarity
    let rankedFoods = foods.map((food) => ({
      ...food,
      similarity: cosineSimilarity(queryEmbedding, food.food_embedding),
    }));

    // Step 5: filter based on query keywords
    const lowerQuery = query.toLowerCase();
    rankedFoods = rankedFoods.filter((food) => {
      let keep = true;

      // Low-calorie (<300), Moderate (300-400), High (>400)
      if (lowerQuery.includes('low calorie'))
        keep = keep && food.calories <= 300;
      if (lowerQuery.includes('moderate calorie'))
        keep = keep && food.calories > 300 && food.calories <= 400;
      if (lowerQuery.includes('high calorie'))
        keep = keep && food.calories > 400;

      if (lowerQuery.includes('high protein'))
        keep = keep && food.protein >= 30;
      if (lowerQuery.includes('low protein')) keep = keep && food.protein < 15;

      if (lowerQuery.includes('muscle') || lowerQuery.includes('gym')) {
        keep = keep && food.suitability?.includes('muscle-building');
      }

      if (lowerQuery.includes('weight loss')) {
        keep = keep && food.suitability?.includes('weight-loss');
      }

      return keep;
    });

    // Step 6: sort by similarity descending
    rankedFoods.sort((a, b) => b.similarity - a.similarity);

    // Step 7: take top 4 results
    rankedFoods = rankedFoods.slice(0, 4);

    // Step 8: send response
    res.status(200).json({
      success: true,
      query,
      results: rankedFoods.map((f) => ({
        food_name: f.food_name,
        food_description: f.food_description,
        food_category: f.food_category,
        food_price: f.food_price,
        food_image_url: f.food_image_url,
        protein: f.protein,
        food_calories: f.calories,
        serving_size_g: f.serving_size_g,
        similarity: f.similarity.toFixed(3),
      })),
    });
  } catch (error) {
    console.error('NLP Search Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error during NLP search' });
  }
};

export { nlpSearch };

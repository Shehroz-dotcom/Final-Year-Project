import foodModel from '../../models/food.model.js';
import { getEmbedding } from '../../utils/NlpConfig/getEmbedding.js';

const nlpSearch = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Received search query:', query);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const queryEmbedding = await getEmbedding(query);

    if (!queryEmbedding || queryEmbedding.length !== 1024) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate query embedding',
      });
    }

    const foods = await foodModel
      .find({ food_embedding: { $exists: true, $ne: [] } })
      .select(
        'food_name food_description food_category food_price food_image_url food_embedding'
      )
      .lean();

    const cosineSimilarity = (vecA, vecB) => {
      const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    };

    // Rank foods by similarity
    let rankedFoods = foods
      .map((food) => ({
        ...food,
        similarity: cosineSimilarity(queryEmbedding, food.food_embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    // Ensure at least 4 unique foods
    if (rankedFoods.length < 4) {
      const existingNames = new Set(
        rankedFoods.map((f) => f.food_name.toLowerCase())
      );
      const missing = 4 - rankedFoods.length;

      const fillerFoods = foods
        .filter((f) => !existingNames.has(f.food_name.toLowerCase()))
        .slice(0, missing)
        .map((f) => ({ ...f, similarity: 0 }));

      rankedFoods = [...rankedFoods, ...fillerFoods];
    } else {
      rankedFoods = rankedFoods.slice(0, 10);
    }

    // Log results
    console.log(
      'Top ranked foods:',
      rankedFoods.map((f) => ({
        name: f.food_name,
        similarity: f.similarity.toFixed(3),
      }))
    );

    res.status(200).json({
      success: true,
      query,
      results: rankedFoods.map((f) => ({
        food_name: f.food_name,
        food_description: f.food_description,
        food_category: f.food_category,
        food_price: f.food_price,
        food_image_url: f.food_image_url,
        food_calories:f.caloies,
        serving_size_g:f.serving_size_g,
        similarity: f.similarity.toFixed(3),
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

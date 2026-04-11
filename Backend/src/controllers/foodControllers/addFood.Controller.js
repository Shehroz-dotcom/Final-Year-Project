import foodModel from '../../models/food.model.js';
import uploadOnCloudinary from '../../utils/Cloudinary/uploadCloudinary.js';
import path from 'path';
import fs from 'fs';
import {
  FOOD_CATEGORY,
  FOOD_TYPE,
  TAG_OPTIONS,
  DIET_COMPATIBILITY,
  SUITABILITY_OPTIONS,
} from '../../utils/Nutritions/nutritions.js';

const addFood = async (req, res) => {
  try {
    const {
      food_name,
      food_description,
      food_price,
      food_category,
      food_type,
      calories,
      serving_size_g,
      protein,
      carbs,
      fat,
      diet_compatibility,
      suitability,
      fiber,
      sugar,
      tags,
      ingredients,
    } = req.body;

    // ✅ 1. Validate required fields
    const requiredFields = [
      food_name,
      food_description,
      food_price,
      food_category,
      food_type,
      calories,
      serving_size_g,
      protein,
      carbs,
      fat,
    ];

    if (
      requiredFields.some(
        (field) =>
          field === undefined ||
          field === null ||
          (typeof field === 'string' && field.trim() === '')
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled',
      });
    }

    // ✅ 2. Normalize category/type
    const normalizedCategory =
      typeof food_category === 'object' ? food_category.name : food_category;

    const normalizedType =
      typeof food_type === 'object' ? food_type.type : food_type;

    if (!FOOD_CATEGORY.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: `Invalid food_category: ${normalizedCategory}`,
      });
    }

    if (!FOOD_TYPE.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid food_type: ${normalizedType}`,
      });
    }

    // ✅ 3. Tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean)
        : tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }

    if (!parsedTags.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one tag is required',
      });
    }

    const invalidTags = parsedTags.filter((t) => !TAG_OPTIONS.includes(t));
    if (invalidTags.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid tag(s): ${invalidTags.join(', ')}`,
      });
    }

    // ✅ 4. Diet compatibility
    const dietArray = Array.isArray(diet_compatibility)
      ? diet_compatibility.map((d) => d.trim())
      : [];

    const invalidDiets = dietArray.filter(
      (d) => !DIET_COMPATIBILITY.includes(d)
    );

    if (invalidDiets.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid diet_compatibility: ${invalidDiets.join(', ')}`,
      });
    }

    // ✅ 5. Suitability
    const suitabilityArray = Array.isArray(suitability)
      ? suitability.map((s) => s.trim())
      : [];

    const invalidSuitability = suitabilityArray.filter(
      (s) => !SUITABILITY_OPTIONS.includes(s)
    );

    if (invalidSuitability.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid suitability: ${invalidSuitability.join(', ')}`,
      });
    }

    // ✅ 6. Ingredients
    let parsedIngredients = [];
    if (ingredients) {
      parsedIngredients = Array.isArray(ingredients)
        ? ingredients.map((i) => i.trim()).filter(Boolean)
        : [ingredients.trim()];
    }

    if (!parsedIngredients.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one ingredient is required',
      });
    }

    // ✅ 7. HEALTH SUITABILITY (FIXED 🔥)
    let healthSuitabilityParsed = {
      diabetic: 'suitable',
      high_cholesterol: 'suitable',
      hypertension: 'suitable',
      weight_management: 'suitable',
    };

    if (req.body.health_suitability) {
      try {
        let parsed = req.body.health_suitability;

        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }

        if (typeof parsed === 'object' && parsed !== null) {
          healthSuitabilityParsed = {
            diabetic:
              parsed.diabetic === 'not_suitable' ? 'not_suitable' : 'suitable',

            high_cholesterol:
              parsed.high_cholesterol === 'not_suitable'
                ? 'not_suitable'
                : 'suitable',

            hypertension:
              parsed.hypertension === 'not_suitable'
                ? 'not_suitable'
                : 'suitable',

            weight_management:
              parsed.weight_management === 'not_suitable'
                ? 'not_suitable'
                : 'suitable',
          };
        }
      } catch (err) {
        console.log('Health parse error:', err);
      }
    }
    // ✅ 8. Image check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required',
      });
    }

    // ✅ 9. Duplicate check
    const normalizedName = food_name.trim().toLowerCase();

    const existingFood = await foodModel.findOne({
      food_name: normalizedName,
    });

    if (existingFood) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: 'Food already exists',
      });
    }

    // ✅ 10. Upload image
    const imagePath = path.isAbsolute(req.file.path)
      ? req.file.path
      : path.resolve(req.file.path);

    const uploaded = await uploadOnCloudinary(imagePath);

    if (!uploaded) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed',
      });
    }

    const { url, public_id } = uploaded;

    // ✅ 11. Create food
    const newFood = await foodModel.create({
      food_name: normalizedName,
      food_description,
      food_price,
      food_image_url: url,
      food_image_public_id: public_id,
      food_category: normalizedCategory,
      food_type: normalizedType,
      calories,
      serving_size_g,
      protein,
      carbs,
      fat,
      fiber: fiber ? Number(fiber) : 0,
      sugar: sugar ? Number(sugar) : 0,
      tags: parsedTags,
      diet_compatibility: dietArray,
      suitability: suitabilityArray,
      ingredients: parsedIngredients,

      // ✅ FIXED FIELD
      health_suitability: healthSuitabilityParsed,
    });

    // ✅ 12. Verify embedding
    const verifiedFood = await foodModel
      .findById(newFood._id)
      .select('+food_embedding');

    console.log('Embedding Size:', verifiedFood.food_embedding?.length);

    return res.status(201).json({
      success: true,
      message: 'Food added successfully',
      food: newFood,
    });
  } catch (error) {
    console.error('Error adding food:', error.message || error);

    return res.status(500).json({
      success: false,
      message: 'Server error while adding food',
      error: error.message || error,
    });
  }
};

export { addFood };

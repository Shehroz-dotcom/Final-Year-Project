import foodModel from '../../models/food.model.js';
import uploadOnCloudinary from '../../utils/Cloudinary/uploadCloudinary.js';
import path from 'path';
import fs from 'fs';
import { FOOD_CATEGORY, FOOD_TYPE } from '../../utils/Nutritions/nutritions.js';

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
      fiber, // optional
      sugar, // optional
      tags, // required
    } = req.body;

    // 1️⃣ Validate required fields
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

    // 2️⃣ Normalize category/type to string
    const normalizedCategory =
      typeof food_category === 'object' ? food_category.name : food_category;
    const normalizedType =
      typeof food_type === 'object' ? food_type.type : food_type;

    console.log('Raw food_category:', food_category);

    // 3️⃣ Validate enums
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

    // 4️⃣ Normalize tags
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

    // 5️⃣ Validate image upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required',
      });
    }

    // 6️⃣ Check if food already exists (case-insensitive)
    const normalizedName = food_name.trim().toLowerCase();
    const existingFood = await foodModel.findOne({ food_name: normalizedName });

    if (existingFood) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Food already exists',
      });
    }

    // 7️⃣ Upload image to Cloudinary
    const imagePath = path.isAbsolute(req.file.path)
      ? req.file.path
      : path.resolve(req.file.path);

    const foodImageCloudinaryPath = await uploadOnCloudinary(imagePath);
    if (!foodImageCloudinaryPath) {
      return res.status(500).json({
        success: false,
        message: 'Image upload to Cloudinary failed',
      });
    }

    const { url, public_id } = foodImageCloudinaryPath;

    // 8️⃣ Create new food
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
    });

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

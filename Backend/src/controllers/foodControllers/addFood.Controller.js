import foodModel from '../../models/food.model.js';
import uploadOnCloudinary from '../../utils/Cloudinary/uploadCloudinary.js';
import path from 'path';
import fs from 'fs';

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
      tags, // required (string or array)
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
          field.toString().trim() === ''
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled',
      });
    }

    // ✅ 2. Validate and normalize tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
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

    // ✅ 3. Validate image upload
    console.log('file  path', req.file.path);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required',
      });
    }

    // ✅ 4. Check if food already exists (case-insensitive)
    const normalizedName = food_name.trim().toLowerCase();
    const existingFood = await foodModel.findOne({ food_name: normalizedName });

    if (existingFood) {
      // remove uploaded image if duplicate found
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Food already exists',
      });
    }

    // ✅ 5. Upload image to Cloudinary
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

    // ✅ 6. Create new food in DB
    const newFood = await foodModel.create({
      food_name: normalizedName,
      food_description,
      food_price,
      food_image_url: url,
      food_image_public_id: public_id,
      food_category,
      food_type,
      calories,
      serving_size_g,
      protein,
      carbs,
      fat,
      fiber: fiber || '',
      sugar: sugar || '',
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

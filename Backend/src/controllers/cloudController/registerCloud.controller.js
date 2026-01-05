import CloudKitchen from '../../models/cloudKitchen.model.js'; // adjust path
import bcrypt from 'bcrypt';

const registerCloud = async (req, res) => {
  try {
    const { branchCode, address, password, latitude, longitude } = req.body;
    console.log(req.body);
    

    console.log(
      'from controller:',
      branchCode,
      address,
      password,
      latitude,
      longitude
    );

    if (!branchCode || !address || !password || !latitude || !longitude) {
      return res.status(400).json({
        message: 'All fields including location are required',
      });
    }

    // Check if branch_code already exists
    const existing = await CloudKitchen.findOne({ branch_code: branchCode });
    if (existing) {
      return res.status(400).json({ message: 'Branch code already exists' });
    }

    // Save cloud kitchen
    const cloudKitchen = await CloudKitchen.create({
      branch_code: branchCode,
      address,
      password, // model pre-save will hash it
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)], // MongoDB requires [lng, lat]
      },
    });

    return res.status(201).json({
      message: 'Cloud kitchen registered successfully',
      cloudKitchenId: cloudKitchen._id,
    });
  } catch (error) {
    console.error('registerCloud error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export { registerCloud };

import CloudKitchenModel from '../../models/cloudKitchen.model.js'; // adjust path
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../../utils/CloudTokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/CloudTokenGenerator/generateRefreshToken.js';

const registerCloudKitchen = async (req, res) => {
  try {
    const { branchCode, address, password, latitude, longitude } = req.body;
    
    //required fields validations 
    if (!branchCode || !address || !password || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    //check for existing branch
    const existing = await CloudKitchenModel.findOne({
      branch_code: branchCode,
    });
    if (existing) {
      return res.status(409).json({ message: 'Branch code already exists' });
    }
    //create  cloud  kitchen
    const newCloudKitchen = await CloudKitchenModel.create({
      branch_code: branchCode,
      address,
      password,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    const createdKitchen = await CloudKitchenModel.findById(newCloudKitchen._id)
    .select('-password -refreshToken')

  if(!createdKitchen){
    return res.status(500).json({
      success:false,
      message: 'Something went wrong while creating a  kitchen'

    })
  }

    const { accessToken } = await generateAccessToken(newCloudKitchen._id);
    const { refreshToken } = await generateRefreshToken(newCloudKitchen._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    return res
      .status(201)
      .cookie('cloudAccessToken', accessToken, options)
      .cookie('cloudRefreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'Cloud kitchen registered successfully',
        cloudKitchen: createdKitchen,
      });
  } catch (error) {
    console.error('registerCloud error:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error',
    });
  }
};
export {registerCloudKitchen}

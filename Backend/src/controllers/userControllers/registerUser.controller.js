import userModel from '../../models/user.model.js';
import { generateAccessToken } from '../../utils/TokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/TokenGenerator/generateRefreshToken.js';

const registerUser = async (req, res) => {
  const { fullName, email, password, address, phoneNo } = req.body;

  try {
    // Required fields validation
    if (!fullName || !email || !password || !address || !phoneNo) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Email uniqueness check
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = await userModel.create({
      fullName,
      email,
      password,
      address,
      phoneNo,
    });

    const createdUser = await userModel
      .findById(newUser._id)
      .select('-password -refreshToken');

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while creating the user',
      });
    }

    // Generate tokens
    const { accessToken } = await generateAccessToken(newUser._id);
    const { refreshToken } = await generateRefreshToken(newUser._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    return res
      .status(201)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'User created successfully',
        user: createdUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export { registerUser };

import userModel from '../../models/user.model.js';
import { generateAccessToken } from '../../utils/TokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/TokenGenerator/generateRefreshToken.js';

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = await userModel.create({
      fullName,
      email,
      password,
    });

    const createdUser = await userModel
      .findById(newUser._id)
      .select('-password -refreshToken');

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: 'something went wrong while creating a user',
      });
    }

    const { accessToken } = await generateAccessToken(newUser._id);
    const { refreshToken } = await generateRefreshToken(newUser._id);
   

    const options = {
      //by default any one can modify your cokies from frontend but when you introduce httpOnly then only from server the cookies can be modified
      httpOnly: true,
      //secure: true only in production Https
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    return res
      .status(201)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'user Created Successfully',
        user: createdUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export { registerUser };

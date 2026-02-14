import adminModel from '../../models/admin.model.js';
import { generateAccessToken } from '../../utils/AdminTokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/AdminTokenGenerator/generateRefreshToken.js';
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const findAdmin = await adminModel.findOne({ email });

    if (!findAdmin) {
      return res.status(404).json({
        success: false,
        message: 'admin does not exists ',
      });
    }

    const isPasswordCorrect = await findAdmin.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid  admin credentials ',
      });
    }

    const { refreshToken } = await generateRefreshToken(findAdmin._id);
    const { accessToken } = await generateAccessToken(findAdmin._id);

    const loggedInAdmin = await adminModel
      .findById(findAdmin._id)
      .select("-password,-refreshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true only in production (HTTPS)
      sameSite: 'lax', // allows cookies on localhost
    };

    return res
      .status(200)
      .cookie('adminAccessToken', accessToken, options)
      .cookie('adminRefreshToken', refreshToken, options)
      .json({
        admin: loggedInAdmin,
        success: true,
        accessToken,
        refreshToken,
        message: 'Admin logged in successfully',
      });
  } catch (error) {
    console.error('Error in admin Login');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export { adminLogin };

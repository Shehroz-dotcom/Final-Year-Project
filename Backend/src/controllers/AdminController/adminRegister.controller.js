import adminModel from '../../models/admin.model.js';
import { generateAccessToken } from '../../utils/AdminTokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/AdminTokenGenerator/generateRefreshToken.js';
const adminRegister = async (req, res) => {
  const { fullName, email, password, secretKey } = req.body;
  try {
    if (!fullName || !email || !password || !secretKey) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    //email uniqnes check
    const existedAdmin = await adminModel.findOne({ email });
    if (existedAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with email already exists',
      });
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(409).json({
        success: false,
        message: 'Secret key is not correct',
      });
    }
    //create new admin
    const newAdmin = await adminModel.create({
      fullName,
      email,
      password,
    });

    const createdAdmin = await adminModel
      .findById(newAdmin._id)
      .select('-password');

    if (!createdAdmin) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while creating admin',
      });
    }

    //generate tokens
    const { accessToken } = await generateAccessToken(newAdmin._id);
    const { refreshToken } = await generateRefreshToken(newAdmin._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    return res
      .status(201)
      .cookie('adminAccessToken', accessToken, options)
      .cookie('adminRefreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'Admin registered successfully',
        admin: createdAdmin,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export { adminRegister };

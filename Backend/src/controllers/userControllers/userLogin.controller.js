import userModel from '../../models/user.model.js';
import { generateAccessToken } from '../../utils/TokenGenerator/generateAccessToken.js';
import { generateRefreshToken } from '../../utils/TokenGenerator/generateRefreshToken.js';

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password is required',
      });
    }

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: 'User doesnot exists !',
      });
    }

    // the user you get from the db have acces to methods you make using userSchema.methods.()
    const isPasswordValid = await findUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User credentials',
      });
    }
    //generating tokens
    const { refreshToken } = await generateRefreshToken(findUser._id);
    const { accessToken } = await generateAccessToken(findUser._id);

    const loggedInUser = await userModel
      .findById(findUser._id)
      .select('-password -refreshToken');

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true only in production (HTTPS)
      sameSite: 'lax', // allows cookies on localhost
    };
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        //in this sending again the tokens we are handling a separate case where user itself want to save the access and refresh token to localstorage or  setting  in the mobile application
        user: loggedInUser,
        success: true,
        accessToken,
        refreshToken,
        message: 'User Logged In Successfully',
      });
  } catch (error) {
    console.error('Error in userLogin:', error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
export { userLogin };

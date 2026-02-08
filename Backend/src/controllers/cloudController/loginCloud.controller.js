import CloudKitchenModel from '../../models/cloudKitchen.model.js';
import { generateAccessToken } from '../../utils/CloudTokenGenerator/generateAccessToken.js';
import {generateRefreshToken} from "../../utils/CloudTokenGenerator/generateRefreshToken.js"
const loginCloudKitchen = async (req, res) => {
  try {
    const { branch_code, password } = req.body;
    console.log("REQ BODY: " , req.body);
    
    if (!branch_code || !password) {
      return res.status(400).json({
        success: false,
        message: 'branch code and password  is required',
      });
    }

    console.log(branch_code, password);

   

    //find branch
    const findKitchen = await CloudKitchenModel.findOne({ branch_code });
    
    

    if (!findKitchen) {
      return res.status(404).json({
        success: false,
        message: 'kitchen does not exists',
      });
    }
    const isPasswordValid = await findKitchen.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalied kitchen credentials',
      });
    }

    //generate tokens
    const { refreshToken } = await generateRefreshToken(findKitchen._id);
    const { accessToken } = await generateAccessToken(findKitchen._id);

    const loggedInkitchen = await CloudKitchenModel.findById(
      findKitchen._id
    ).select('-password -refreshToken');

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };
    return res
      .status(200)
      .cookie('cloudAccessToken', accessToken, options)
      .cookie('cloudRefreshToken', refreshToken, options)
      .json({
        kitchen: loggedInkitchen,
        success: true,
        accessToken,
        refreshToken,
        message: 'kitchen logged in successfully',
      });
  } catch (error) {
    console.error('Error in loginCloudKitchen:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
export { loginCloudKitchen };

import userModel from "../../models/user.model.js"
const  generateRefreshToken  = async(userId) => {
  try {
    const user = await userModel.findById(userId)
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });
    return {refreshToken}
  } catch (error) {
    throw new Error("Error generating refresh token");
  }

} 

export {generateRefreshToken}
import userModel from "../../models/user.model.js"
const  generateAccessToken  = async(userId) => {
  try {
    const user = await userModel.findById(userId)
    const accessToken = user.generateAccessToken()

    return {accessToken}
  } catch (error) {
  throw new Error("Error generating access token");;
  }

} 

export {generateAccessToken}
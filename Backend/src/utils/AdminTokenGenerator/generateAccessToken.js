import adminModel from "../../models/admin.model.js"
const generateAccessToken = async (adminId) => {    
    try {
        const admin = await adminModel.findById(adminId)
        const accessToken = admin.generateAccessToken()
        return {accessToken}
    } catch (error) {
        throw new Error ("Error generating access token")
    }
}

export {generateAccessToken}
import CloudKitchenModel from "../../models/cloudKitchen.model.js";
const generateAccessToken = async(CloudKitchenId) => {
    try {
        const cloudKitchen = await CloudKitchenModel.findById(CloudKitchenId)
        const accessToken = cloudKitchen.generateAccessToken()
        return {accessToken}
    } catch (error) {
        throw new Error ("Error generating access token")
        
    }
}

export {generateAccessToken}
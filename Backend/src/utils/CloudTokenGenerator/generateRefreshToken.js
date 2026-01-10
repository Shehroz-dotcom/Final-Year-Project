import CloudKitchenModel from "../../models/cloudKitchen.model.js";
const generateRefreshToken = async(CloudKitchenId) => {
    try {
        const cloudKitchen = await CloudKitchenModel.findById(CloudKitchenId)
        if(!cloudKitchen){
            throw new Error("cloud kitchen not found")
        }
        const refreshToken = cloudKitchen.generateRefreshToken()
        cloudKitchen.refreshToken = refreshToken
        await cloudKitchen.save({validateBeforeSave: false})
        return {refreshToken}
    } catch (error) {
        console.error("error while generating refresh Token" , error);
        throw error
        
    }
}

export {generateRefreshToken}
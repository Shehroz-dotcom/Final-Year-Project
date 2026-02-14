import adminModel from "../../models/admin.model.js"
const generateRefreshToken = async (adminId) => {
    try {
        const admin =  await adminModel.findById(adminId)

        if(!admin){
            throw new  Error("admin not  found")
        }
        const refreshToken = admin.generateRefreshToken()
        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSave: false})
        return {refreshToken}
    } catch (error) {
        console.error("error while generating refresh Token" , error)
        throw error
    }

}
export {generateRefreshToken}
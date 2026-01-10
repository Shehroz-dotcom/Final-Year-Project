import {Router} from "express"
import {registerCloudKitchen} from "../controllers/cloudController/registerCloud.controller.js"
import { loginCloudKitchen } from "../controllers/cloudController/loginCloud.controller.js"
const cloudRouter  = Router()

cloudRouter.route("/register").post(registerCloudKitchen)
cloudRouter.route("/login").post(loginCloudKitchen)


export {cloudRouter}
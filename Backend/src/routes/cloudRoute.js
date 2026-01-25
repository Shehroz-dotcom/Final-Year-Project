import {Router} from "express"
import {registerCloudKitchen} from "../controllers/cloudController/registerCloud.controller.js"
import { loginCloudKitchen } from "../controllers/cloudController/loginCloud.controller.js"
import { getAllKitchens } from "../controllers/cloudController/getAllKitchens.controller.js"
import { deleteCloudKitchen } from "../controllers/cloudController/deleteCloudKitchen.controller.js"
const cloudRouter  = Router()

cloudRouter.route("/register").post(registerCloudKitchen)
cloudRouter.route("/login").post(loginCloudKitchen)
cloudRouter.route("/getAllKitchens").get(getAllKitchens)
cloudRouter.route("/deleteKitchen").post(deleteCloudKitchen)

export {cloudRouter}
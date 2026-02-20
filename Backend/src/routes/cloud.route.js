import {Router} from "express"
import {registerCloudKitchen} from "../controllers/cloudController/registerCloud.controller.js"
import { loginCloudKitchen } from "../controllers/cloudController/loginCloud.controller.js"
import { getAllKitchens } from "../controllers/cloudController/getAllKitchens.controller.js"
import { deleteCloudKitchen } from "../controllers/cloudController/deleteCloudKitchen.controller.js"
import { getOrders } from "../controllers/cloudController/getOrders.controller.js"
import { handleStatusChange } from "../controllers/cloudController/handleStatusChange.controller.js"
import { logOut } from "../controllers/cloudController/logOut.controller.js"
import { markDelivered } from "../controllers/cloudController/markDelivered.controller.js"
const cloudRouter  = Router()

cloudRouter.route("/register").post(registerCloudKitchen)
cloudRouter.route("/login").post(loginCloudKitchen)
cloudRouter.route("/logout").post(logOut)
cloudRouter.route("/getAllKitchens").get(getAllKitchens)
cloudRouter.route("/deleteKitchen").post(deleteCloudKitchen)
cloudRouter.route("/getOrders").get(getOrders)
cloudRouter.route("/:orderId/status").patch(handleStatusChange)
cloudRouter.route("/:orderId/:branchCode/delivered").post(markDelivered)

export {cloudRouter}
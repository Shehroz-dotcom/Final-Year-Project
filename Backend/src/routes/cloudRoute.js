import {Router} from "express"
import {registerCloud} from "../controllers/cloudController/registerCloud.controller.js"
const cloudRouter  = Router()

cloudRouter.route("/register").post(registerCloud)


export {cloudRouter}
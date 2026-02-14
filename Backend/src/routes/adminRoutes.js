import {Router} from 'express'
import { getOrders } from '../controllers/AdminController/getOrders.controller.js'
import {adminLogin} from "../controllers/AdminController/adminLogin.controller.js"
import {adminRegister} from "../controllers/AdminController/adminRegister.controller.js"

const AdminRouter =  Router()
AdminRouter.route("/login").post(adminLogin)
AdminRouter.route("/register").post(adminRegister)

AdminRouter.route('/getOrders/:kitchenId').get(getOrders)

export {AdminRouter}
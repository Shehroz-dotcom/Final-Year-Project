import {Router} from 'express'
import { getOrders } from '../controllers/AdminController/getOrders.controller.js'

const AdminRouter =  Router()

AdminRouter.route('/getOrders/:kitchenId').get(getOrders)

export {AdminRouter}
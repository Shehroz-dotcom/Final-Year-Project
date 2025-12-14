import {Router} from 'express'
import { PlaceOrder } from '../controllers/OrderController/PlaceOrder.Controller.js'
import { FetchAllOrders } from '../controllers/OrderController/FetchAllOrders.js'
//auth middleware might need it 
const orderRouter = Router()

orderRouter.route("/placeOrder").post(PlaceOrder)
orderRouter.route("/getOrders").get(FetchAllOrders)


export {orderRouter}



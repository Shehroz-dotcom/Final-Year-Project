import {Router} from 'express'
import { PlaceOrder } from '../controllers/OrderController/PlaceOrder.Controller.js'
//auth middleware might need it 
const orderRouter = Router()

orderRouter.route("/placeOrder").post(PlaceOrder)


export {orderRouter}



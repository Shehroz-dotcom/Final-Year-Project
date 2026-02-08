import { Router } from 'express';
import { PlaceOrder } from '../controllers/OrderController/PlaceOrder.Controller.js';
import { FetchAllOrders } from '../controllers/OrderController/FetchAllOrders.js';
import { FetchOrder } from '../controllers/OrderController/FetchOrder.controller.js';
//auth middleware might need it
const orderRouter = Router();

orderRouter.route('/placeOrder').post(PlaceOrder);
orderRouter.route('/getOrders/:kitchenId').get(FetchAllOrders);
orderRouter.route('/getOrder/:branchCode/:orderId').get(FetchOrder);

export { orderRouter };

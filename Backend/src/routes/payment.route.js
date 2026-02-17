import {Router} from "express"
import { PaymentController } from "../controllers/PaymentController/Payment.controller.js"

const paymentRouter = Router()
paymentRouter.route('/create-payment-intent').post(PaymentController)

export {paymentRouter}
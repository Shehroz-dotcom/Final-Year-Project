import {Router} from "express"
import { createPaymentIntent } from "../controllers/PaymentController/createPaymentIntent.Controller.js"

const paymentRouter = Router()
paymentRouter.route('/create-payment-intent').post(createPaymentIntent)

export {paymentRouter}
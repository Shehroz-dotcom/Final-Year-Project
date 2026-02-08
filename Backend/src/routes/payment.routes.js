import { Router } from "express";
import { createPaymentIntent } from "../controllers/paymentController/createPaymentIntent.controller.js";

const paymentRouter = Router();

paymentRouter.route("/create-payment-intent").post(createPaymentIntent);

export { paymentRouter };

import express from "express";
import { sendContactEmail } from "../controllers/ContactController/contactController.js";

const sendContactEmailrouter = express.Router();

sendContactEmailrouter.route("/send").post(sendContactEmail)

export  {sendContactEmailrouter};

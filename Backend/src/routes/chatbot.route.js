import { Router } from 'express';
import { Chatbot } from '../controllers/ChatbotController/Chatbot.controller.js';
const chatBotRouter = Router();
chatBotRouter.route('/query').post(Chatbot);
export { chatBotRouter };

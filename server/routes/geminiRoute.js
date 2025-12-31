import express from 'express';
import { generateContent, chatWithNeha } from '../controllers/geminiController.js';

const geminiRouter = express.Router();

geminiRouter.post('/generate', generateContent);

geminiRouter.post('/chat', chatWithNeha);

export default geminiRouter;

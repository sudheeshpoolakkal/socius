import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default genAI;
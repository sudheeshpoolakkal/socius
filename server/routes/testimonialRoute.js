import express from 'express';
import { getTestimonials, addTestimonial } from '../controllers/testimonialController.js';

const testimonialRouter = express.Router();

testimonialRouter.get('/testimonials', getTestimonials);
testimonialRouter.post('/testimonials', addTestimonial);

export default testimonialRouter;
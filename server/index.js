import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import itemRouter from './routes/itemRoute.js';
import prescriptionRouter from './routes/prescriptionRoutes.js';
import hospitalRouter from './routes/hospitalRoute.js';
import geminiRouter from './routes/geminiRoute.js';
import scheduleReminders from './utils/requestScheduler.js';
import startVerificationScheduler from './utils/verificationScheduler.js';
import testimonialRouter from './routes/testimonialRoute.js';
import forumRouter from './routes/forumRoute.js';
import cabBookingRoute from './routes/cabBookingRoute.js';
import courseRouter from './routes/courseRoute.js';
import { scheduleExpiryCleanup } from './utils/requestExpiry.js';

const app = express();
const port = process.env.PORT || 4000;
// Connect to the database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}
connectCloudinary();
// Avoid background jobs in test environment
if (process.env.NODE_ENV !== 'test') {
  scheduleReminders();
  scheduleExpiryCleanup();
  startVerificationScheduler();
}


// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/prescription', prescriptionRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api', testimonialRouter);
app.use('/api/forum', forumRouter);
app.use('/api/cab', cabBookingRoute);
app.use('/api/courses', courseRouter);

app.get('/', (req, res) => {
  res.send('API WORKING');
});




// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test' && import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}


export default app;

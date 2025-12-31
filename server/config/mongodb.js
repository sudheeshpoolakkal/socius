import mongoose from 'mongoose';
import seedTestimonials from '../utils/seed.js';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/spiritus`);
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1); // Exit process with failure
    }
  }
};

export default connectDB;
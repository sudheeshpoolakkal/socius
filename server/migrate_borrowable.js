import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemModel from './models/itemModel.js';

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        const result = await itemModel.updateMany(
            { isBorrowable: { $exists: false } },
            { $set: { isBorrowable: true } }
        );
        console.log("Updated docs:", result);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
migrate();

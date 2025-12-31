import cron from 'node-cron';
import requestModel from '../models/requestModel.js';
import { generateVerificationCode } from './verificationCode.js';

let schedulerTask;

/**
 * Generates verification codes for requests starting today.
 * This runs every hour to ensure codes are ready for pickup.
 */
const generateVerificationCodes = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

        // Find approved requests starting today that don't have a code yet
        const requests = await requestModel.find({
            startDate: { $gte: startOfDay, $lte: endOfDay },
            status: 'approved',
            verificationCode: { $exists: false }
        });

        for (const request of requests) {
            try {
                const verificationCode = generateVerificationCode();

                await requestModel.findByIdAndUpdate(request._id, {
                    verificationCode,
                    verificationTimestamp: new Date()
                });

                console.log(`Generated verification code ${verificationCode} for request ${request._id}`);
            } catch (error) {
                console.error(`Error processing request ${request._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in verification code generation task:', error);
    }
};

export const startVerificationScheduler = () => {
    // Run every hour
    schedulerTask = cron.schedule('0 * * * *', generateVerificationCodes);
    console.log('Verification scheduler started');
};

export default startVerificationScheduler;
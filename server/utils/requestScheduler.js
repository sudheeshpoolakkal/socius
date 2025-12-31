import cron from 'node-cron';
import requestModel from '../models/requestModel.js';
import sendEmail from './email.js';
import { requestReminderEmail } from './emailTemplates.js';

const scheduleReminders = () => {
    // Schedule to run every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
        try {
            const now = new Date();
            const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

            // Calculate start and end of that day
            const startOfDay = new Date(threeDaysFromNow.setHours(0, 0, 0, 0)).getTime();
            const endOfDay = new Date(threeDaysFromNow.setHours(23, 59, 59, 999)).getTime();

            // Find active requests ending in 3 days
            const requests = await requestModel.find({
                endDate: { $gte: startOfDay, $lte: endOfDay },
                status: 'active',
                isCompleted: false
            });

            for (const request of requests) {
                // Send email
                const emailOptions = {
                    email: request.userData.email,
                    subject: 'Item Return Reminder',
                    html: requestReminderEmail(request.userData.name, request.itemData.name, 3),
                };
                await sendEmail(emailOptions);
            }
        } catch (error) {
            console.error('Error sending reminders:', error);
        }
    });
};

export default scheduleReminders;

import requestModel from '../models/requestModel.js';

// Function to check and clean up expired pending requests
// For example, if a request is pending for more than 48 hours without approval, or approved but not paid.
export const cleanupExpiredRequests = async () => {
    try {
        const now = Date.now();
        const twoDaysAgo = now - (48 * 60 * 60 * 1000);

        // Find pending requests created more than 48 hours ago
        // referencing 'date' field which iscreation timestamp
        const expiredRequests = await requestModel.find({
            date: { $lt: twoDaysAgo },
            status: 'pending',
            payment: false
        });

        for (const request of expiredRequests) {
            // Mark as cancelled
            await requestModel.findByIdAndUpdate(request._id, {
                status: 'cancelled'
            });
            console.log(`Auto-cancelled expired request: ${request._id}`);
        }
    } catch (error) {
        console.error('Error cleaning up expired requests:', error);
    }
};

// Schedule the cleanup
export const scheduleExpiryCleanup = () => {
    // Run immediately on startup
    cleanupExpiredRequests();

    // Then run every hour
    setInterval(cleanupExpiredRequests, 60 * 60 * 1000);
};

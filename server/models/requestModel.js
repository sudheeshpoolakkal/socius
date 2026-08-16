import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // The Borrower
    itemId: { type: String, required: true }, // The Item
    itemData: { type: Object, required: true }, // Snapshot of item details
    userData: { type: Object, required: true }, // Snapshot of borrower details

    // Request Details
    startDate: { type: Number, required: true }, // Timestamp
    endDate: { type: Number, required: true }, // Timestamp
    duration: { type: Number, required: true }, // Number of days
    amount: { type: Number, required: true }, // Total Deposit Amount

    // Request Type
    type: { type: String, enum: ['borrow', 'buy'], default: 'borrow' },
    offerPrice: { type: Number }, // Only for 'buy' requests

    // Status
    status: { type: String, default: 'pending' }, // pending, approved, active, completed, cancelled

    // Payment/Deposit
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    // Renewals
    renewals: [{
        date: { type: Number, required: true },
        duration: { type: Number, required: true }, // Days extended
        amount: { type: Number, default: 0 } // Cost of renewal (if any)
    }],

    // Feedback
    isRated: { type: Boolean, default: false },
    tipAmount: { type: Number, default: 0 },
    ratingType: { type: String, enum: ['positive', 'negative', 'none'], default: 'none' }
})

const requestModel = mongoose.models.request || mongoose.model("request", requestSchema);
export default requestModel;

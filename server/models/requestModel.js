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

    // Status
    status: { type: String, default: 'pending' }, // pending, approved, active, completed, cancelled

    // Payment/Deposit
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const requestModel = mongoose.models.request || mongoose.model("request", requestSchema);
export default requestModel;

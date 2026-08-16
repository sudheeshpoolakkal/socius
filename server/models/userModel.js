import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  image: { type: String },
  address: { type: Object },
  gender: { type: String },
  dob: { type: String },
  phone: { type: String, required: false, sparse: true },
  questionnaire: { type: Object },
  isAnonymous: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  transactions: { type: Array, default: [] },
  isMember: { type: Boolean, default: false },
  membershipType: { type: String, default: 'None' },
  membershipExpiry: { type: Date, default: null },
  karma: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 }
  }
})

// Create a compound index for phone uniqueness only when isAnonymous is true
userSchema.index({ phone: 1, isAnonymous: 1 }, {
  unique: true,
  partialFilterExpression: { isAnonymous: true, phone: { $exists: true, $ne: null } }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel
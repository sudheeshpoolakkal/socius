import mongoose from 'mongoose';

const cabBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who booked the cab
    required: false
  },
  pickup: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  ride: {
    name: String,
    price: Number,
    eta: Number,
    passengers: Number,
    description: String
  },
  driver: {
    name: String,
    vehicle: String,
    licensePlate: String,
    phone: String,
    rating: { type: Number, default: 0 }
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledTime: {
    type: Date // The scheduled time for the cab pickup
  },
  estimatedFare: {
    type: Number,
    required: true
  },
  actualFare: {
    type: Number
  },
  pickupTime: {
    type: Date,
    default: Date.now
  },
  arrivalTime: {
    type: Date
  },
  completionTime: {
    type: Date
  },
  distance: {
    type: Number, // in kilometers
    default: 0
  },
  duration: {
    type: Number // in minutes
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export default mongoose.model('CabBooking', cabBookingSchema);
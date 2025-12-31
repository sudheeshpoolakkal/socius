import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicle: {
    make: String,
    model: String,
    color: String,
    licensePlate: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['sedan', 'suv', 'van', 'accessible'],
      default: 'sedan'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  currentBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CabBooking',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Driver', driverSchema);
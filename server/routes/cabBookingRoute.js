import express from 'express';
const router = express.Router();
import { 
  bookCab, 
  getBookingDetails, 
  cancelBooking,
  updateBookingStatus,
  getUserBookings
} from '../controllers/cabBookingController.js';

// Route for booking a cab
router.post('/book', bookCab);

// Route to get booking details by booking ID
router.get('/booking/:bookingId', getBookingDetails);

// Route to cancel a booking
router.put('/booking/:bookingId/cancel', cancelBooking);

// Route to update booking status
router.put('/booking/:bookingId/status', updateBookingStatus);

// Route to get all bookings for a user
router.get('/user/:userId', getUserBookings);

export default router;

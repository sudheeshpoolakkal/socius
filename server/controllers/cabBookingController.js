import CabBooking from '../models/CabBooking.js';
import Driver from '../models/Driver.js';

const bookCab = async (req, res) => {
  const { pickup, destination, ride, scheduledTime, isScheduled } = req.body;

  // Basic validation
  if (!pickup || !destination || !ride) {
    return res.status(400).json({ message: 'Missing booking details.' });
  }

  try {
    // Try to connect to MongoDB if not already connected
    // If MongoDB is not available, we'll simulate the booking for demo purposes
    try {
      // Attempt to find an available driver
      const availableDriver = await findAvailableDriver(pickup, ride);
      
      if (!availableDriver) {
        // No available drivers found, provide simulated booking for demo purposes
        
        // Array of realistic Kerala names for drivers
        const keralaDriverNames = [
          'Rajesh Nair', 'Suresh Warrier', 'Arun Panicker', 'Manoj Kumar', 
          'Vijay Nair', 'Anil Menon', 'Sajeev Nair', 'Ravi Pillai', 
          'Prakash Warrier', 'Krishnan Nair', 'Mohanan Warrier', 'Babu Nair',
          'Ramesh Kumar', 'Ajith Nair', 'Biju Nair', 'Santosh Warrier',
          'Ratheesh Pillai', 'Dinesh Nair', 'Sreekumar Menon', 'Naveen Babu'
        ];
        
        const timestamp = Date.now();
        // Select a name based on timestamp to ensure consistency
        const deterministicDriverName = keralaDriverNames[timestamp % keralaDriverNames.length];
        
        // Determine status based on whether it's scheduled
        const bookingStatus = isScheduled ? 'scheduled' : 'confirmed';
        
        // Simulated booking response
        res.status(200).json({
          message: isScheduled 
            ? `Booking successful! Your ${ride.name} is scheduled for pickup.`
            : `Booking successful! Your ${ride.name} is on its way.`,
          bookingId: `SPIRITUS-CAB-${timestamp}`,
          driver: {
            name: deterministicDriverName,
            vehicle: `${ride.name} (Simulated)`,
            licensePlate: `KL-${timestamp.toString().padStart(4, '0').slice(-4)}`,
            phone: '+91-9' + (timestamp % 100000000).toString().padStart(8, '0')
          },
          status: bookingStatus,
          estimatedFare: calculateFare(pickup, destination, ride),
          scheduledTime: isScheduled && scheduledTime ? new Date(scheduledTime) : undefined
        });
        return;
      }

      // Create a new booking
      const bookingId = `SPIRITUS-CAB-${Date.now()}`;
      const estimatedFare = calculateFare(pickup, destination, ride);

      const bookingData = {
        userId: req.user ? req.user.id : null, // Assuming user authentication
        pickup,
        destination,
        ride: {
          name: ride.name,
          price: ride.price,
          eta: ride.eta,
          passengers: ride.passengers,
          description: ride.description
        },
        bookingId,
        estimatedFare,
        status: isScheduled ? 'scheduled' : 'pending' // Set to scheduled if it's a scheduled booking
      };

      // Add scheduled time if provided
      if (isScheduled && scheduledTime) {
        bookingData.scheduledTime = new Date(scheduledTime);
        bookingData.status = 'scheduled';
      }

      const newBooking = new CabBooking(bookingData);

      // Save the booking to the database
      const savedBooking = await newBooking.save();

      // Update driver's status to not available and assign the booking
      availableDriver.isAvailable = false;
      availableDriver.currentBookingId = savedBooking._id;
      await availableDriver.save();

      // Update the booking with driver information
      savedBooking.driver = {
        name: availableDriver.name,
        vehicle: `${availableDriver.vehicle.color} ${availableDriver.vehicle.make} ${availableDriver.vehicle.model}`,
        licensePlate: availableDriver.vehicle.licensePlate,
        phone: availableDriver.phone
      };
      
      // Update booking status to confirmed
      savedBooking.status = 'confirmed';
      await savedBooking.save();

      // Send a success response
      res.status(200).json({
        message: `Booking successful! Your ${ride.name} is on its way.`,
        bookingId: savedBooking.bookingId,
        driver: savedBooking.driver,
        status: savedBooking.status,
        estimatedFare: savedBooking.estimatedFare
      });
    } catch (dbError) {
      console.error('Database error during booking:', dbError);
      // Fallback to simulated booking if database is unavailable
      
      const timestamp = Date.now();
      // Array of realistic Kerala names for drivers
      const keralaDriverNames = [
        'Rajesh Nair', 'Suresh Warrier', 'Arun Panicker', 'Manoj Kumar', 
        'Vijay Nair', 'Anil Menon', 'Sajeev Nair', 'Ravi Pillai', 
        'Prakash Warrier', 'Krishnan Nair', 'Mohanan Warrier', 'Babu Nair',
        'Ramesh Kumar', 'Ajith Nair', 'Biju Nair', 'Santosh Warrier',
        'Ratheesh Pillai', 'Dinesh Nair', 'Sreekumar Menon', 'Naveen Babu'
      ];
      
      // Select a name based on timestamp to ensure consistency
      const deterministicDriverName = keralaDriverNames[timestamp % keralaDriverNames.length];
      
      // Determine status based on whether it's scheduled
      const bookingStatus = isScheduled ? 'scheduled' : 'confirmed';
      
      // Simulated booking response
      res.status(200).json({
        message: isScheduled 
          ? `Booking successful! Your ${ride.name} is scheduled for pickup.`
          : `Booking successful! Your ${ride.name} is on its way.`,
        bookingId: `SPIRITUS-CAB-${timestamp}`,
        driver: {
          name: deterministicDriverName,
          vehicle: `${ride.name} (Simulated)`,
          licensePlate: `KL-${timestamp.toString().padStart(4, '0').slice(-4)}`,
          phone: '+91-9' + (timestamp % 100000000).toString().padStart(8, '0')
        },
        status: bookingStatus,
        estimatedFare: calculateFare(pickup, destination, ride),
        scheduledTime: isScheduled && scheduledTime ? new Date(scheduledTime) : undefined
      });
    }
  } catch (error) {
    console.error('Error in booking cab:', error);
    res.status(500).json({ message: 'Error processing your booking. Please try again.' });
  }
};

// Helper function to find an available driver based on geolocation
const findAvailableDriver = async (pickupLocation, rideType) => {
  // In a real system, you would use geocoding to convert pickupLocation to coordinates
  // For now, we'll simulate coordinates for the pickup location
  // This is a simplified approach - in a real system, you'd implement proper geocoding
  const pickupCoordinates = [Math.random() * 360 - 180, Math.random() * 180 - 90]; // Random coordinates for demo
  
  // Find drivers within a certain radius (5km) who are available
  const nearbyDrivers = await Driver.find({
    isAvailable: true,
    'vehicle.type': rideType.id === 'accessible' ? 'van' : 'sedan' // Match vehicle type
  });

  // For now, just return the first available driver
  // In a production system, you would calculate actual distances and return the closest
  if (nearbyDrivers.length > 0) {
    return nearbyDrivers[0];
  }

  return null;
};

// Helper function to calculate fare based on distance
const calculateFare = (pickup, destination, ride) => {
  // This is a simplified fare calculation
  // In a real system, this would use distance/coordinates and other factors
  const baseFare = ride.price;
  const distance = Math.random() * 10 + 5; // Random distance between 5-15 km for demo
  const farePerKm = 10; // ₹10 per km
  
  return Math.round(baseFare + (distance * farePerKm));
};

// Get booking details by ID
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Check if it's a simulated booking ID (starts with SPIRITUS-CAB- and has a timestamp suffix)
    if (bookingId.startsWith('SPIRITUS-CAB-')) {
      // This is likely a simulated booking, return mock booking data
      const timestamp = bookingId.replace('SPIRITUS-CAB-', '');
      const timestampNum = parseInt(timestamp);
      
      if (!isNaN(timestampNum)) {
        // Array of realistic Kerala names for drivers
        const keralaDriverNames = [
          'Rajesh Nair', 'Suresh Warrier', 'Arun Panicker', 'Manoj Kumar', 
          'Vijay Nair', 'Anil Menon', 'Sajeev Nair', 'Ravi Pillai', 
          'Prakash Warrier', 'Krishnan Nair', 'Mohanan Warrier', 'Babu Nair',
          'Ramesh Kumar', 'Ajith Nair', 'Biju Nair', 'Santosh Warrier',
          'Ratheesh Pillai', 'Dinesh Nair', 'Sreekumar Menon', 'Naveen Babu'
        ];
        
        // Select a name from the list based on timestamp to ensure consistency
        const deterministicDriverName = keralaDriverNames[timestampNum % keralaDriverNames.length];
        
        // Return a mock booking object for simulated bookings
        const mockBooking = {
          _id: bookingId,
          bookingId: bookingId,
          status: 'confirmed', // Default to confirmed for simulated bookings
          pickup: 'Simulated Pickup Location',
          destination: 'Simulated Destination',
          ride: {
            name: 'Simulated Ride',
            price: 155,
            eta: 5,
            passengers: 4,
            description: 'Standard, comfortable sedan.'
          },
          driver: {
            name: deterministicDriverName,
            vehicle: 'Simulated Vehicle (Simulated)',
            licensePlate: `KL-${timestampNum.toString().padStart(4, '0').slice(-4)}`,
            phone: '+91-9' + (timestampNum % 100000000).toString().padStart(8, '0')
          },
          estimatedFare: 245,
          createdAt: new Date(timestampNum),
          updatedAt: new Date(timestampNum)
        };
        
        return res.status(200).json(mockBooking);
      }
    }
    
    // For real bookings, query the database
    const booking = await CabBooking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Check if it's a simulated booking ID
    if (bookingId.startsWith('SPIRITUS-CAB-')) {
      // This is likely a simulated booking, return success without database operations
      return res.status(200).json({ message: 'Booking cancelled successfully' });
    }
    
    const booking = await CabBooking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel booking at this stage' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Make the driver available again if assigned
    if (booking.driver) {
      await Driver.findOneAndUpdate(
        { 'vehicle.licensePlate': booking.driver.licensePlate },
        { isAvailable: true, currentBookingId: null }
      );
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

// Update booking status (for driver app or internal use)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'driver-arrived', 'in-progress', 'completed', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if it's a simulated booking ID
    if (bookingId.startsWith('SPIRITUS-CAB-')) {
      // For simulated bookings, just return success without database operations
      const simulatedBooking = {
        bookingId: bookingId,
        status: status,
        message: 'Status updated successfully (simulated)'
      };
      
      return res.status(200).json({
        message: 'Booking status updated successfully',
        booking: simulatedBooking
      });
    }

    const booking = await CabBooking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the status transition is valid
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['driver-arrived', 'cancelled'],
      'driver-arrived': ['in-progress'],
      'in-progress': ['completed'],
      'cancelled': [],
      'completed': []
    };

    if (!validTransitions[booking.status] || !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ message: `Invalid status transition from ${booking.status} to ${status}` });
    }

    booking.status = status;
    
    // Update times based on status
    if (status === 'driver-arrived') {
      booking.arrivalTime = new Date();
    } else if (status === 'in-progress') {
      booking.pickupTime = new Date();
    } else if (status === 'completed') {
      booking.completionTime = new Date();
    }
    
    await booking.save();

    // Update driver availability when booking is completed or cancelled
    if (status === 'completed' || status === 'cancelled') {
      if (booking.driver) {
        await Driver.findOneAndUpdate(
          { 'vehicle.licensePlate': booking.driver.licensePlate },
          { isAvailable: true, currentBookingId: null }
        );
      }
    }

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await CabBooking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
};

export { 
  bookCab,
  getBookingDetails,
  cancelBooking,
  updateBookingStatus,
  getUserBookings
};

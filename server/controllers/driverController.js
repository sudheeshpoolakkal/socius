import Driver from '../models/Driver.js';

// Create a new driver
const createDriver = async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, vehicle } = req.body;

    // Check if driver with this email or license number already exists
    const existingDriver = await Driver.findOne({
      $or: [{ email }, { licenseNumber }, { 'vehicle.licensePlate': vehicle.licensePlate }]
    });

    if (existingDriver) {
      return res.status(400).json({ message: 'Driver with this email, license number, or vehicle plate already exists' });
    }

    const newDriver = new Driver({
      name,
      email,
      phone,
      licenseNumber,
      vehicle
    });

    const savedDriver = await newDriver.save();
    res.status(201).json({
      message: 'Driver created successfully',
      driver: savedDriver
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Error creating driver' });
  }
};

// Get all available drivers
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true });
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    res.status(500).json({ message: 'Error fetching available drivers' });
  }
};

// Update driver availability
const updateDriverAvailability = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { isAvailable } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      { isAvailable },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({
      message: 'Driver availability updated',
      driver: updatedDriver
    });
  } catch (error) {
    console.error('Error updating driver availability:', error);
    res.status(500).json({ message: 'Error updating driver availability' });
  }
};

export {
  createDriver,
  getAvailableDrivers,
  updateDriverAvailability
};
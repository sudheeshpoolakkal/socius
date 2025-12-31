import mongoose from 'mongoose';
import 'dotenv/config';

// Import the Driver model
import Driver from './models/Driver.js';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Spiritus', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Sample drivers data
const sampleDrivers = [
  {
    name: "Ramesh Kumar",
    email: "ramesh.driver@example.com",
    phone: "+91-9876543210",
    licenseNumber: "DL-2023-123456",
    vehicle: {
      make: "Toyota",
      model: "Etios",
      color: "White",
      licensePlate: "DL-01-AB-1234",
      type: "sedan"
    }
  },
  {
    name: "Suresh Singh",
    email: "suresh.driver@example.com",
    phone: "+91-8765432109",
    licenseNumber: "DL-2023-789012",
    vehicle: {
      make: "Honda",
      model: "City",
      color: "Black",
      licensePlate: "DL-02-CD-5678",
      type: "sedan"
    }
  },
  {
    name: "Amit Patel",
    email: "amit.driver@example.com",
    phone: "+91-7654321098",
    licenseNumber: "MH-2023-345678",
    vehicle: {
      make: "Tata",
      model: "Nexon",
      color: "Silver",
      licensePlate: "MH-12-EF-9012",
      type: "suv"
    }
  },
  {
    name: "Rajesh Sharma",
    email: "rajesh.driver@example.com",
    phone: "+91-6543210987",
    licenseNumber: "UP-2023-901234",
    vehicle: {
      make: "Toyota",
      model: "Innova",
      color: "Golden",
      licensePlate: "UP-09-GH-3456",
      type: "van"
    }
  }
];

// Function to add sample drivers
const addSampleDrivers = async () => {
  try {
    // Clear existing drivers (optional, remove if you don't want to clear)
    await Driver.deleteMany({});

    // Add new drivers
    for (const driverData of sampleDrivers) {
      const existingDriver = await Driver.findOne({
        $or: [
          { email: driverData.email },
          { licenseNumber: driverData.licenseNumber },
          { 'vehicle.licensePlate': driverData.vehicle.licensePlate }
        ]
      });

      if (!existingDriver) {
        const driver = new Driver(driverData);
        await driver.save();
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample drivers:', error);
    process.exit(1);
  }
};

// Run the function
addSampleDrivers();
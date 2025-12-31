import express from 'express';
const router = express.Router();
import { 
  createDriver, 
  getAvailableDrivers, 
  updateDriverAvailability 
} from '../controllers/driverController.js';

// Route to create a new driver
router.post('/create', createDriver);

// Route to get all available drivers
router.get('/available', getAvailableDrivers);

// Route to update driver availability
router.put('/:driverId/availability', updateDriverAvailability);

export default router;
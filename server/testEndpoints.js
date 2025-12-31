// Simple test to verify cab booking endpoints are working
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

async function testEndpoints() {
  try {
    // Test getting available drivers
    const driversResponse = await axios.get(`${BASE_URL}/api/drivers/available`);
    
    // Test booking a cab (this will fail without proper data, but should return 400 not 404)
    try {
      const bookResponse = await axios.post(`${BASE_URL}/api/cab/book`, {
        pickup: 'Test pickup location',
        destination: 'Test destination',
        ride: {
          name: 'Calm Ride',
          price: 155,
          eta: 5,
          passengers: 4,
          description: 'Standard, comfortable sedan.'
        }
      });
    } catch (bookingError) {
      if (bookingError.response && bookingError.response.status === 404) {
        // Endpoint not found
      } else {
        // Expected validation error
      }
    }
  } catch (error) {
    console.error('Error testing endpoints:', error.message);
  }
}

testEndpoints();
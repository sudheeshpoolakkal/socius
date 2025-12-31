/**
 * Geographic utility functions for location-based operations
 */

// Haversine formula to calculate distance between two points on Earth
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

// Function to filter doctors by location and radius
export const filterDoctorsByLocation = (doctors, userLat, userLng, radiusKm) => {
  if (!userLat || !userLng || !radiusKm) {
    return doctors;
  }

  return doctors.filter(doctor => {
    // Check if doctor has valid coordinates
    if (!doctor.address?.coordinates?.lat || !doctor.address?.coordinates?.lng) {
      return false;
    }

    const distance = calculateDistance(
      userLat,
      userLng,
      doctor.address.coordinates.lat,
      doctor.address.coordinates.lng
    );

    return distance <= radiusKm;
  }).map(doctor => ({
    ...doctor,
    // Add distance field for sorting and display
    distance: calculateDistance(
      userLat,
      userLng,
      doctor.address.coordinates.lat,
      doctor.address.coordinates.lng
    )
  })).sort((a, b) => a.distance - b.distance); // Sort by nearest first
};

// Function to validate coordinates
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// Function to get user's approximate location from IP (basic implementation)
// Note: This is a simplified version. In production, you might want to use a more sophisticated IP geolocation service
export const getLocationFromIP = async (req) => {
  // This is a placeholder - you'd typically use a service like MaxMind, IPGeolocation, etc.
  // For now, return a default location (you can enhance this later)
  const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  
  // Default to a central location if IP geolocation is not available
  // You can replace this with actual IP geolocation service
  return {
    lat: 28.6139, // New Delhi coordinates as default
    lng: 77.2090,
    city: 'New Delhi',
    country: 'India'
  };
};

export default {
  calculateDistance,
  filterDoctorsByLocation,
  isValidCoordinates,
  getLocationFromIP
};
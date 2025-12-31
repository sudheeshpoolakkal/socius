import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaSearch } from 'react-icons/fa';

const LocationSearch = ({ onLocationSearch, isLoading }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [locationMethod, setLocationMethod] = useState('auto'); // 'auto' or 'manual'
  const [gettingLocation, setGettingLocation] = useState(false);

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 2, label: '2 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 50, label: '50 km' }
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setGettingLocation(false);
          
          // Automatically trigger search with current location
          onLocationSearch({
            lat: latitude,
            lng: longitude,
            radius: selectedRadius,
            method: 'geolocation'
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setGettingLocation(false);
          alert("Unable to get your location. Please try manual location entry.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setGettingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle manual location search using geocoding
  const handleManualLocationSearch = async () => {
    if (!manualLocation.trim()) return;

    try {
      // Using a simple geocoding approach - in production, you might want to use Google Maps Geocoding API
      // For now, we'll simulate this with a basic implementation
      
      // This is a placeholder - you would typically integrate with:
      // 1. Google Maps Geocoding API
      // 2. Mapbox Geocoding API
      // 3. OpenStreetMap Nominatim
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const location = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          
          setUserLocation(location);
          onLocationSearch({
            ...location,
            radius: selectedRadius,
            method: 'manual',
            searchQuery: manualLocation
          });
        } else {
          alert("Location not found. Please try a different address.");
        }
      } else {
        throw new Error('Geocoding failed');
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      alert("Unable to find the location. Please try again or use your current location.");
    }
  };

  // Handle radius change
  const handleRadiusChange = (newRadius) => {
    setSelectedRadius(newRadius);
    
    if (userLocation) {
      onLocationSearch({
        ...userLocation,
        radius: newRadius,
        method: locationMethod === 'auto' ? 'geolocation' : 'manual'
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FaMapMarkerAlt className="text-green-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Find Doctors Near You</h3>
          <p className="text-sm text-gray-600">Search for available doctors in your area</p>
        </div>
      </div>

      {/* Location Method Selection */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            onClick={() => setLocationMethod('auto')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              locationMethod === 'auto'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaLocationArrow className={locationMethod === 'auto' ? 'text-green-600' : 'text-gray-400'} />
            Current Location
          </button>
          <button
            onClick={() => setLocationMethod('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              locationMethod === 'manual'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaSearch className={locationMethod === 'manual' ? 'text-green-600' : 'text-gray-400'} />
            Enter Address
          </button>
        </div>

        {/* Auto Location */}
        {locationMethod === 'auto' && (
          <div className="space-y-3">
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaLocationArrow className="text-lg" />
              <span className="font-medium">
                {gettingLocation ? 'Detecting Location...' : 'Use My Current Location'}
              </span>
            </button>
            
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-green-700 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                <FaMapMarkerAlt className="text-green-600" />
                <span className="font-medium">Location successfully detected</span>
              </div>
            )}
          </div>
        )}

        {/* Manual Location */}
        {locationMethod === 'manual' && (
          <div className="space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Enter city, address, or landmark..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSearch()}
              />
            </div>
            <button
              onClick={handleManualLocationSearch}
              disabled={!manualLocation.trim() || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaSearch />
              <span className="font-medium">Search Location</span>
            </button>
          </div>
        )}
      </div>

      {/* Radius Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>Search Radius</span>
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
            {selectedRadius} km
          </span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {radiusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRadiusChange(option.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedRadius === option.value
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Status */}
      {isLoading && (
        <div className="text-center py-4 bg-green-50 rounded-xl border border-green-100">
          <div className="inline-flex items-center gap-3 text-green-700">
            <div className="animate-spin rounded-full h-5 w-5 border-3 border-green-600 border-t-transparent"></div>
            <span className="font-medium">Searching for nearby doctors...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
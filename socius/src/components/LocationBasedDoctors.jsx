import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';

const LocationBasedDoctors = ({ doctors, searchParams, isLoading, error }) => {
  const navigate = useNavigate();

  // Helper function to format distance
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Helper function to get distance color based on proximity
  const getDistanceColor = (distance) => {
    if (distance <= 1) return 'text-green-600';
    if (distance <= 5) return 'text-blue-600';
    if (distance <= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Searching for doctors near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <FaMapMarkerAlt className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Doctors Found</h3>
        <p className="text-gray-600 mb-4">
          {searchParams?.radius ? (
            `No doctors found within ${searchParams.radius}km of your location.`
          ) : (
            'No doctors found in the specified area.'
          )}
        </p>
        <p className="text-sm text-gray-500">
          Try increasing the search radius or searching in a different area.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Results Header */}
      {searchParams && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-green-600" />
            <h3 className="font-semibold text-gray-900">Search Results</h3>
          </div>
          <p className="text-sm text-gray-600">
            Found {doctors.length} doctors within {searchParams.radius}km of your location
            {searchParams.speciality && ` • Specialty: ${searchParams.speciality}`}
            {searchParams.language && ` • Language: ${searchParams.language}`}
          </p>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor, index) => {
          const avgRating = doctor.reviews && doctor.reviews.length > 0
            ? (doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length).toFixed(1)
            : null;

          return (
            <div
              key={doctor._id || index}
              onClick={() => navigate(`/appointment/${doctor._id}`)}
              className="bg-white rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden"
            >
              {/* Doctor Image */}
              <div className="w-full aspect-square overflow-hidden bg-gray-100">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={doctor.image}
                  alt={doctor.name}
                  loading="lazy"
                />
              </div>

              {/* Doctor Details */}
              <div className="p-4">
                {/* Top Row - Availability and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        doctor.available ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <span className={doctor.available ? 'text-green-600' : 'text-red-600'}>
                      {doctor.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  {avgRating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar className="text-sm" />
                      <span className="text-xs text-gray-700">{avgRating}</span>
                    </div>
                  )}
                </div>

                {/* Doctor Name and Specialty */}
                <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                  {doctor.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {doctor.speciality}
                </p>

                {/* Distance Information */}
                {doctor.distance !== undefined && (
                  <div className="flex items-center gap-1 mb-2">
                    <FaRoute className={`text-xs ${getDistanceColor(doctor.distance)}`} />
                    <span className={`text-xs font-medium ${getDistanceColor(doctor.distance)}`}>
                      {formatDistance(doctor.distance)} away
                    </span>
                  </div>
                )}

                {/* Fee Information */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{doctor.fees}
                  </span>
                  {doctor.address?.formatted && (
                    <div className="text-xs text-gray-500 max-w-24 truncate" title={doctor.address.formatted}>
                      {doctor.address.formatted}
                    </div>
                  )}
                </div>

                {/* Languages */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doctor.languages.slice(0, 3).map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                    {doctor.languages.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                        +{doctor.languages.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {doctors.length >= 20 && (
        <div className="text-center mt-8">
          <button 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => {
              // This could trigger loading more results
              console.log('Load more results');
            }}
          >
            Load More Doctors
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationBasedDoctors;
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Spiritus...</p>
    </div>
  );
};

export default LoadingSpinner;

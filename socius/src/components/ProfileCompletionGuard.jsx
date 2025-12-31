import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProfileCompletionGuard = ({ children }) => {
  const { userData, token } = useContext(AppContext);
  const location = useLocation();

  if (!token || !userData) {
    // If not logged in or user data is not loaded yet, do nothing.
    return children;
  }

  // If the user is anonymous, bypass all profile completion checks.
  if (userData.isAnonymous) {
    return children;
  }

  const { image } = userData;
  const currentPath = location.pathname;

  // For regular users, only check if a profile image has been uploaded.
  if (!image) {
    // If there is no image, redirect to the upload page, unless they are already there or on the login page.
    if (currentPath !== '/upload-profile-image' && currentPath !== '/login') {
      return <Navigate to="/upload-profile-image" />;
    }
  }

  // If the check passes (or doesn't apply), render the requested page.
  return children;
};

export default ProfileCompletionGuard;
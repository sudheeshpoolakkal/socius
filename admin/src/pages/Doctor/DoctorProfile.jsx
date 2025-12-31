import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaSpinner, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaClock,
  FaUserMd,
  FaStar,
  FaCertificate,
  FaBookMedical
} from "react-icons/fa";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localProfileData, setLocalProfileData] = useState(null);

  useEffect(() => {
    if (profileData && !isEdit) {
      setLocalProfileData({ 
        ...profileData,
        address: profileData.address ? { ...profileData.address } : { line1: '', line2: '' },
        mapSrc: profileData.mapSrc || '',
        fees: profileData.fees || '',
        available: profileData.available || false,
        about: profileData.about || ''
      });
    }
  }, [profileData, isEdit]);

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        address: localProfileData.address,
        fees: localProfileData.fees,
        available: localProfileData.available,
        mapSrc: localProfileData.mapSrc,
        about: localProfileData.about,
      };

      const { data } = await axios.post(backendUrl + "/api/doctor/update-profile", updateData, {
        headers: { 
          dToken,
          'Content-Type': 'application/json'
        },
      });

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    if (profileData) {
      setLocalProfileData({ 
        ...profileData,
        address: profileData.address ? { ...profileData.address } : { line1: '', line2: '' },
        mapSrc: profileData.mapSrc || '',
        fees: profileData.fees || '',
        available: profileData.available || false,
        about: profileData.about || ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setLocalProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (addressField, value) => {
    setLocalProfileData(prev => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  if (!localProfileData) return null;

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
          <div className="flex gap-3">
            {isEdit ? (
              <>
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-sm rounded-lg text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition">
                  <FaTimes /> Cancel
                </button>
                <button onClick={updateProfile} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50" disabled={isLoading}>
                  {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setIsEdit(true)} className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg flex items-center gap-2 hover:bg-blue-50 transition">
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                    src={localProfileData.image}
                    alt={`Dr. ${localProfileData.name}`}
                  />
                  <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${localProfileData.available ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{localProfileData.name}</h2>
                <p className="text-sm text-gray-500">{localProfileData.speciality}</p>
              </div>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <FaUserMd className="text-gray-400" />
                  <span>{localProfileData.degree}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-gray-400" />
                  <span>{currency}{localProfileData.fees} per session</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <span>{localProfileData.experience} years of experience</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4">Availability</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  checked={localProfileData.available || false}
                  onChange={(e) => isEdit && handleInputChange('available', e.target.checked)}
                  disabled={!isEdit}
                />
                <label htmlFor="available" className={`text-sm ${localProfileData.available ? 'text-green-600' : 'text-gray-500'}`}>
                  {localProfileData.available ? 'Currently Available for appointments' : 'Not Available for appointments'}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaBookMedical /> About</h3>
              {isEdit ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 h-32 break-all"
                  value={localProfileData.about || ''}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {localProfileData.about || 'No description available'}
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaMapMarkerAlt /> Location</h3>
              {isEdit ? (
                <div className="space-y-2">
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200" value={localProfileData.address?.line1 || ''} onChange={(e) => handleAddressChange('line1', e.target.value)} placeholder="Address Line 1" />
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200" value={localProfileData.address?.line2 || ''} onChange={(e) => handleAddressChange('line2', e.target.value)} placeholder="Address Line 2" />
                  <textarea placeholder="Google Maps Embed URL" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 break-all" value={localProfileData.mapSrc || ''} onChange={(e) => handleInputChange('mapSrc', e.target.value)} rows="3" />
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">{localProfileData.address?.line1 || 'No address'}<br />{localProfileData.address?.line2 || ''}</p>
                  {localProfileData.mapSrc && (
                    <div className="mt-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <iframe src={localProfileData.mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Doctor's Location Preview"></iframe>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaCertificate /> Education & Certifications</h3>
              <p className="text-gray-600">Details about education and certifications can be added here.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaStar /> Patient Reviews</h3>
              <p className="text-gray-600">Patient reviews and ratings will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

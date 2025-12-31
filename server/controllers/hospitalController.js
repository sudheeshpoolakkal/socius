import Hospital from '../models/hospitalModel.js';
// Aliasing new models to old names to prevent massive refactor of legacy code for now
import Doctor from '../models/itemModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/requestModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { extractSrcFromIframe } from '../utils/iframeUtils.js';

// Test route to check hospitals in database
export const testHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).select('email emailAddress hospitalName isReviewed');
    res.json({
      success: true,
      count: hospitals.length,
      hospitals: hospitals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a test hospital
export const createTestHospital = async (req, res) => {
  // Legacy function disabled
  res.json({ success: false, message: "Legacy feature disabled in Socius." });
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find hospital by email OR emailAddress
    const hospital = await Hospital.findOne({
      $or: [
        { email: email.toLowerCase() },
        { emailAddress: email.toLowerCase() }
      ]
    });

    if (!hospital) {
      return res.status(400).json({
        success: false,
        message: 'No hospital found with this email address'
      });
    }

    // Check if hospital is reviewed
    if (!hospital.isReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Hospital registration is under review. Please wait for approval.'
      });
    }

    // Check password
    const isMatch = await hospital.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: hospital._id,
        email: hospital.email,
        hospitalName: hospital.hospitalName
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
      hospital: {
        id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

export const getHospitalProfile = async (req, res) => {
  try {
    res.json({ success: true, hospital: req.hospital });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateHospitalProfile = async (req, res) => {
  try {
    const hospitalId = req.hospital._id;
    const updateData = req.body;

    const allowedFields = [
      'address', 'contactNumber', 'website', 'keyContact',
      'mentalHealthProfessionals', 'specializations', 'currentFees',
      'teletherapy', 'operatingHours', 'emergencySupport',
      'averagePatientLoad', 'insuranceTies', 'accreditations', 'mapSrc'
    ];

    const filteredUpdate = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'mapSrc') {
          filteredUpdate[field] = extractSrcFromIframe(updateData[field]);
        } else {
          filteredUpdate[field] = updateData[field];
        }
      }
    });

    if (typeof filteredUpdate.specializations === 'string') {
      filteredUpdate.specializations = filteredUpdate.specializations.split(',').map(s => s.trim());
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedHospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      hospital: updatedHospital
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getHospitalAppointments = async (req, res) => {
  // Legacy mapping: appointments -> requests. returns empty if schema mismatch prevents finding.
  try {
    const hospitalId = req.hospital._id;
    const hospital = await Hospital.findById(hospitalId).populate('doctors');
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    // const doctorIds = hospital.doctors.map(doc => doc._id);
    // const appointments = await appointmentModel.find({ docId: { $in: doctorIds } }).populate('userData').populate('docData');
    res.json({ success: true, appointments: [] }); // Returning empty to avoid crash
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const listHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isReviewed: true }).select('-password');
    res.json({ success: true, hospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extract lat/lng from common Google Maps URL formats
const extractLatLngFromGoogleMapsUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const atMatch = url.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (dMatch) return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
  } catch (_) { }
  return null;
};

export const addDoctorToHospital = async (req, res) => {
  // Legacy function disabled
  res.json({ success: false, message: "Legacy feature disabled in Socius." });
};

export const getHospitalDoctors = async (req, res) => {
  try {
    const hospitalId = req.hospital._id;
    const hospital = await Hospital.findById(hospitalId).populate('doctors');
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, doctors: hospital.doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  // Return empty/zero stats to avoid crash
  try {
    res.json({
      success: true,
      data: {
        doctors: 0,
        appointments: 0,
        patients: 0,
        earnings: 0,
        specializations: 0,
        latestAppointments: []
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Server Error: Could not fetch dashboard data.' });
  }
};

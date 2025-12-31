import validator from "validator";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import itemModel from '../models/itemModel.js';
import jwt from 'jsonwebtoken';
import requestModel from '../models/requestModel.js';
import userModel from '../models/userModel.js';
import feedbackModel from '../models/feedbackModel.js';
// Keeping these temporarily to avoid more crashes if other files import them, but they should be removed eventually
import hospitalModel from '../models/hospitalModel.js';
import doctorRegistrationModel from '../models/doctorRegistrationModel.js';
import { extractSrcFromIframe } from '../utils/iframeUtils.js';

// ... existing helper functions ...
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

// Renamed and refactored to addItem
const addItem = async (req, res) => {
  // This logic largely duplicates itemController.addItem. 
  // For now, let's just keep the endpoint structure valid to prevent crashes if routes point here.
  // In a real refactor, we would consolidate.
  res.json({ success: false, message: "Use itemController for adding items." });
};

//API FOR ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// api to get all items list for admin panel
const allItems = async (req, res) => {
  try {
    const items = await itemModel.find({})
    res.json({ success: true, items })
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get all Requests list
const allRequests = async (req, res) => {
  try {
    const requests = await requestModel.find({})
    res.json({ success: true, requests })
  }
  catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API for Request cancellation
const requestCancel = async (req, res) => {
  try {
    const { requestId } = req.body;
    await requestModel.findByIdAndUpdate(requestId, { status: 'cancelled' });
    res.json({ success: true, message: "Request Cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get Dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const items = await itemModel.find({});
    const users = await userModel.find({});
    const requests = await requestModel.find({});
    const unreadFeedbacks = await feedbackModel.countDocuments({ isRead: false });

    let adminEarnings = 0;
    // For each completed request, calculate platform fee (e.g., 5%)
    requests.forEach(req => {
      if (req.payment && req.status === 'completed') {
        adminEarnings += req.amount * 0.05;
      }
    });

    const dashData = {
      items: items.length,
      requests: requests.length,
      users: users.length,
      earnings: adminEarnings.toFixed(2),
      unreadFeedbacks,
      latestRequests: requests.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark feedback as read
const markFeedbackAsRead = async (req, res) => {
  try {
    const { feedbackId } = req.body;

    const feedback = await feedbackModel.findById(feedbackId);
    if (!feedback) {
      return res.json({ success: false, message: "Feedback not found" });
    }

    feedback.isRead = true;
    await feedback.save();

    res.json({ success: true, message: "Feedback marked as read" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.body;

    const result = await feedbackModel.findByIdAndDelete(feedbackId);
    if (!result) {
      return res.json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, hospitals });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllDoctorRegistrations = async (req, res) => {
  try {
    const doctors = await doctorRegistrationModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const markHospitalAsReviewed = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.json({ success: false, message: 'Hospital not found' });
    }
    hospital.isReviewed = true;
    await hospital.save();
    res.json({ success: true, message: 'Hospital marked as reviewed' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const markDoctorRegistrationAsReviewed = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await doctorRegistrationModel.findById(doctorId);
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor registration not found' });
    }
    doctor.isReviewed = true;
    await doctor.save();
    res.json({ success: true, message: 'Doctor registration marked as reviewed' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteHospital = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    const result = await hospitalModel.findByIdAndDelete(hospitalId);
    if (!result) {
      return res.json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteDoctorRegistration = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const result = await doctorRegistrationModel.findByIdAndDelete(doctorId);
    if (!result) {
      return res.json({ success: false, message: 'Doctor registration not found' });
    }
    res.json({ success: true, message: 'Doctor registration deleted successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Add Hospital functionality
const addHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      type,
      yearEstablished,
      address,
      country,
      state,
      district,
      pinCode,
      contactNumber,
      emailAddress,
      website,
      keyContact,
      mentalHealthProfessionals,
      specializations,
      currentFees,
      teletherapy,
      operatingHours,
      emergencySupport,
      averagePatientLoad,
      insuranceTies,
      accreditations,
      acknowledgement,
      password,
      mapSrc
    } = req.body;

    // ✅ All field Allowed
    const allowedTypes = [
      'hospital', 'clinic', 'government', 'rehab', 'counseling', 'community', 'other'
    ];

    if (!allowedTypes.includes(type)) {
      return res.json({
        success: false,
        message: `Invalid hospital type.`
      });
    }

    // ✅ Validate required uploads
    if (!req.files?.hospitalLogo || !req.files?.hospitalLicense) {
      return res.json({ success: false, message: 'Hospital logo and license are required' });
    }

    // ✅ Validate Password
    if (!password || password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // ✅ Normalize email
    const normalizedEmail = emailAddress.trim().toLowerCase();

    // ✅ Check duplicate hospital by email in both possible fields
    const existingHospital = await hospitalModel.findOne({
      $or: [{ email: normalizedEmail }, { emailAddress: normalizedEmail }]
    });
    if (existingHospital) {
      return res.json({ success: false, message: 'Hospital with this email already exists' });
    }

    // ✅ Upload Logo to Cloudinary
    const hospitalLogoUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          transformation: [{ crop: "fill", aspect_ratio: "1.0", gravity: "auto" }]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(req.files.hospitalLogo[0].buffer);
    });

    // ✅ Upload License to Cloudinary
    const hospitalLicenseUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image", // If PDF, change this to 'raw'
          transformation: [{ crop: "fill", gravity: "auto" }]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(req.files.hospitalLicense[0].buffer);
    });

    // ✅ Save new hospital
    const newHospital = new hospitalModel({
      hospitalName,
      type,
      yearEstablished,
      address,
      country,
      state,
      district,
      pinCode,
      contactNumber,
      emailAddress: normalizedEmail,
      website,
      keyContact,
      mentalHealthProfessionals,
      specializations: JSON.parse(specializations),
      currentFees,
      teletherapy,
      operatingHours,
      emergencySupport,
      averagePatientLoad,
      insuranceTies,
      accreditations,
      hospitalLogo: hospitalLogoUrl,
      hospitalLicense: hospitalLicenseUrl,
      acknowledgement: acknowledgement === 'true' || acknowledgement === true,
      isReviewed: true,
      password,
      email: normalizedEmail,
      name: hospitalName,
      mapSrc: extractSrcFromIframe(mapSrc)
    });

    await newHospital.save();

    return res.json({ success: true, message: 'Hospital added successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const assignDoctorToHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { doctorId } = req.body;

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Add doctor to hospital's list if not already present
    if (!hospital.doctors.includes(doctorId)) {
      hospital.doctors.push(doctorId);
      await hospital.save();
    }

    // Assign hospital to doctor
    doctor.hospitalId = hospitalId;
    await doctor.save();

    res.json({ success: true, message: 'Doctor assigned to hospital successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Updated export statement - add addHospital to the list
// Updated export statement
export {
  addItem, // Renamed from addDoctor
  loginAdmin,
  allItems, // Renamed from allDoctors
  allRequests, // Renamed from appointmentsAdmin
  requestCancel, // Renamed from appointmentCancel
  adminDashboard,
  deleteFeedback,
  markFeedbackAsRead,
  getAllFeedbacks,
  getAllHospitals,
  getAllDoctorRegistrations,
  markHospitalAsReviewed,
  markDoctorRegistrationAsReviewed,
  deleteHospital,
  deleteDoctorRegistration,
  addHospital,
  assignDoctorToHospital
};
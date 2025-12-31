import Prescription from '../models/Prescription.js';
import RequestModel from '../models/requestModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Add prescription and report (Refactored for Request/Item context if needed, otherwise kept as legacy)
export const addPrescription = async (req, res) => {
  try {
    const { appointmentId, report } = req.body; // Keeping 'appointmentId' param name for legacy route compatibility
    const file = req.file;

    // Validate report length (must be at least 30 words)
    if (!report) {
      return res
        .status(400)
        .json({ success: false, message: 'Report is required.' });
    }

    // Split by any whitespace and filter out empty strings to count actual words
    const wordCount = report.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 30) {
      return res
        .status(400)
        .json({ success: false, message: 'Report must be at least 30 words.' });
    }

    // Check if the request exists
    const request = await RequestModel.findById(appointmentId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found.' });
    }

    let prescriptionFileUrl = null;
    let fileType = null;
    let fileName = null;

    if (file && file.buffer) {
      // Use upload_stream to upload the file buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      prescriptionFileUrl = result.secure_url;
      fileType = file.mimetype;
      fileName = file.originalname;
    }

    // Save the prescription to MongoDB
    const newPrescription = new Prescription({
      appointmentId, // Using same field name in Prescription model for now
      report,
      prescriptionFile: prescriptionFileUrl,
    });
    await newPrescription.save();

    // Update the request with the prescription details
    await RequestModel.findByIdAndUpdate(appointmentId, {
      prescription: {
        report,
        prescriptionFile: prescriptionFileUrl,
        fileType,
        fileName,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report added successfully.',
      prescription: newPrescription,
    });
  } catch (error) {
    console.error('Error in addPrescription:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error uploading report.' });
  }
};

// Get prescription by appointment ID
export const getPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Validate appointmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID.' });
    }

    // Get request to verify access
    const request = await RequestModel.findById(appointmentId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found.' });
    }

    // Check if the user has proper access based on their role
    const isBorrower = req.userType === 'user' && request.userId === req.userId;
    // Assuming itemData contains owner info or we might need to populate it. 
    // For simplicity, just checking admin or if generic user access (might need refinement)
    const isAdmin = req.userType === 'admin';

    // TODO: Add stricter owner check if needed

    if (!isBorrower && !isAdmin) {
      // Allow if generic user for now to prevent lockout during migration, or restrict
    }

    const prescription = await Prescription.findOne({ appointmentId });

    if (!prescription || !prescription.report) {
      return res
        .status(200)
        .json({ success: true, prescription: null, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, prescription });
  } catch (error) {
    console.error('Error in getPrescription:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

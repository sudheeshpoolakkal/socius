import express from 'express';
import {
  addItem,
  loginAdmin,
  allItems,
  allRequests,
  requestCancel,
  adminDashboard,
  getAllFeedbacks,
  markFeedbackAsRead,
  deleteFeedback,
  getAllHospitals,
  getAllDoctorRegistrations,
  markHospitalAsReviewed,
  markDoctorRegistrationAsReviewed,
  deleteHospital,
  deleteDoctorRegistration,
  addHospital,
  assignDoctorToHospital,
} from '../controllers/adminController.js';
import { toggleAvailability } from '../controllers/itemController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';

const adminRouter = express.Router();

adminRouter.post('/add-item', authAdmin, upload.single('image'), addItem);
adminRouter.post('/add-hospital', authAdmin, upload.fields([{ name: 'hospitalLogo' }, { name: 'hospitalLicense' }]), addHospital);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-items', authAdmin, allItems);
adminRouter.post('/change-availability', authAdmin, toggleAvailability);
adminRouter.get('/requests', authAdmin, allRequests);
adminRouter.post('/cancel-request', authAdmin, requestCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);
adminRouter.get('/feedbacks', authAdmin, getAllFeedbacks);
adminRouter.post('/mark-feedback-read', authAdmin, markFeedbackAsRead);
adminRouter.post('/delete-feedback', authAdmin, deleteFeedback);
adminRouter.get('/hospitals', authAdmin, getAllHospitals);
adminRouter.get('/doctor-registrations', authAdmin, getAllDoctorRegistrations);
adminRouter.post('/mark-hospital-reviewed', authAdmin, markHospitalAsReviewed);
adminRouter.post('/mark-doctor-registration-reviewed', authAdmin, markDoctorRegistrationAsReviewed);
adminRouter.post('/delete-hospital', authAdmin, deleteHospital);
adminRouter.post('/delete-doctor-registration', authAdmin, deleteDoctorRegistration);
adminRouter.post('/hospitals/:hospitalId/assign-doctor', authAdmin, assignDoctorToHospital);


export default adminRouter;
import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  requestItem,
  listRequests,
  cancelRequest,
  listIncomingRequests,
  updateRequestStatus,
  registerAnonymous,
  loginAnonymous,
  getWallet,
  addFunds
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);

// Borrowing Flow
userRouter.post('/request-item', authUser, requestItem); // Replaces book-appointment
userRouter.get('/requests', authUser, listRequests);     // Replaces appointments
userRouter.post('/cancel-request', authUser, cancelRequest); // Replaces cancel-appointment
userRouter.get('/incoming-requests', authUser, listIncomingRequests);
userRouter.post('/update-request-status', authUser, updateRequestStatus);

// Anonymous Auth
userRouter.post('/register-anonymous', registerAnonymous);
userRouter.post('/login-anonymous', loginAnonymous);
// Wallet
userRouter.get('/wallet', authUser, getWallet);
userRouter.post('/add-funds', authUser, addFunds);

export default userRouter;

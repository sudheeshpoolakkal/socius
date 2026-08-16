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

  getWallet,
  addFunds,
  purchaseMembership,
  buyItem,
  uploadProfileImage,
  renewRequest,
  tipAndRateOwner,
  requestPurchase,
  completePurchase
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/upload-profile-image', upload.single('image'), authUser, uploadProfileImage);

// Borrowing Flow
userRouter.post('/request-item', authUser, requestItem); // Replaces book-appointment
userRouter.get('/requests', authUser, listRequests);     // Replaces appointments
userRouter.post('/cancel-request', authUser, cancelRequest); // Replaces cancel-appointment
userRouter.get('/incoming-requests', authUser, listIncomingRequests);
userRouter.post('/update-request-status', authUser, updateRequestStatus);
userRouter.post('/buy-item', authUser, buyItem);
userRouter.post('/request-purchase', authUser, requestPurchase);
userRouter.post('/complete-purchase', authUser, completePurchase);

// Renewals & Karma
userRouter.post('/renew-request', authUser, renewRequest);
userRouter.post('/tip-rate-owner', authUser, tipAndRateOwner);


// Wallet
userRouter.get('/wallet', authUser, getWallet);
userRouter.post('/add-funds', authUser, addFunds);
userRouter.post('/purchase-membership', authUser, purchaseMembership);

export default userRouter;

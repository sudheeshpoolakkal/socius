import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import itemModel from '../models/itemModel.js';
import requestModel from '../models/requestModel.js';
import { v2 as cloudinary } from 'cloudinary';

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) return res.json({ success: false, message: "Missing Details" });
    if (!validator.isEmail(email)) return res.json({ success: false, message: "Enter a valid email" });
    if (password.length < 8) return res.json({ success: false, message: "Enter a Strong Password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) return res.json({ success: false, message: "Data Missing" });

    let updateData = { name, phone, address: JSON.parse(address), dob, gender };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(req.userId, updateData);
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Request an Item (formerly bookAppointment)
const requestItem = async (req, res) => {
  try {
    const { itemId, startDate, endDate, duration } = req.body;
    const userId = req.userId;

    const itemData = await itemModel.findById(itemId).populate('owner');
    if (!itemData || !itemData.available) {
      return res.json({ success: false, message: 'Item not available' });
    }

    const userData = await userModel.findById(userId).select('-password');

    // Calculate amount (deposit) - simpler logic for now
    const amount = itemData.deposit;

    const newRequest = new requestModel({
      userId,
      itemId,
      userData,
      itemData,
      startDate,
      endDate,
      duration,
      amount,
      date: Date.now()
    });

    await newRequest.save();

    // Optionally update item slots or availability here if we want to block dates
    // itemData.slots_booked[startDate] = ... (logic to be refined later)

    res.json({ success: true, message: 'Request sent successfully!' });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to List User Requests (formerly listAppointment)
const listRequests = async (req, res) => {
  try {
    const requests = await requestModel.find({ userId: req.userId });
    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Cancel Request
const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await requestModel.findByIdAndUpdate(requestId, { status: 'cancelled' });
    res.json({ success: true, message: 'Request cancelled' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to List Incoming Requests for User's Items
const listIncomingRequests = async (req, res) => {
  try {
    // 1. Find all items owned by the user
    const userItems = await itemModel.find({ owner: req.userId });
    const itemIds = userItems.map(item => item._id);

    // 2. Find requests for these items
    // Populate userData to show who is requesting
    // Populate itemData to show which item is requested
    const requests = await requestModel.find({ itemId: { $in: itemIds } })
      .populate('userData', 'name image phone')
      .populate('itemData', 'name image');

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Update Request Status (Approve/Reject/Complete)
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!['approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    // Verify user owns the item (security check)
    const item = await itemModel.findById(request.itemId);
    if (item.owner.toString() !== req.userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await requestModel.findByIdAndUpdate(requestId, { status });
    res.json({ success: true, message: `Request ${status}` });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Register Anonymous User
const registerAnonymous = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.json({ success: false, message: "Missing Details" });
    if (password.length < 8) return res.json({ success: false, message: "Enter a Strong Password" });

    // Check if user already exists
    const existingUser = await userModel.findOne({ phone, isAnonymous: true });
    if (existingUser) return res.json({ success: false, message: "Account already exists for this phone" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ phone, password: hashedPassword, isAnonymous: true, name: `User_${phone.slice(-4)}` });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Login Anonymous User
const loginAnonymous = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await userModel.findOne({ phone, isAnonymous: true });
    if (!user) return res.json({ success: false, message: "Account does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, message: "Login successful!" });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get Wallet details
const getWallet = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json({ success: true, balance: user.walletBalance, transactions: user.transactions });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Add Funds to Wallet
const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId;

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    const user = await userModel.findById(userId);
    user.walletBalance += Number(amount);

    user.transactions.push({
      type: 'credit',
      amount: Number(amount),
      date: new Date(),
      description: 'Funds added to wallet'
    });

    await user.save();

    res.json({ success: true, message: "Funds added successfully", balance: user.walletBalance });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};

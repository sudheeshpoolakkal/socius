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


const uploadProfileImage = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) return res.json({ success: false, message: "No image uploaded" });

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const image = imageUpload.secure_url;

    await userModel.findByIdAndUpdate(req.userId, { image });
    res.json({ success: true, message: "Image Uploaded Successfully", image });
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

// API to Buy an Item
const buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;

    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    if (!item.isBuyable) {
      return res.json({ success: false, message: "This item is not for sale" });
    }

    if (item.sold || !item.available) {
      return res.json({ success: false, message: "Item is already sold or unavailable" });
    }

    if (item.owner.toString() === userId) {
      return res.json({ success: false, message: "You cannot buy your own item" });
    }

    const buyer = await userModel.findById(userId);
    if (buyer.walletBalance < item.price) {
      return res.json({ success: false, message: "Insufficient wallet balance" });
    }

    // Process Transaction
    // 1. Deduct from Buyer
    buyer.walletBalance -= item.price;
    buyer.transactions.push({
      type: 'debit',
      amount: item.price,
      date: new Date(),
      description: `Purchased item: ${item.name}`
    });
    await buyer.save();

    // 2. Add to Seller (Owner)
    const seller = await userModel.findById(item.owner);
    if (seller) {
      seller.walletBalance += item.price;
      seller.transactions.push({
        type: 'credit',
        amount: item.price,
        date: new Date(),
        description: `Sold item: ${item.name}`
      });
      await seller.save();
    }

    // 3. Update Item Status
    item.sold = true;
    item.available = false; // logic: sold items are no longer available
    await item.save();

    res.json({ success: true, message: "Purchase successful!" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// API to Purchase Membership
const purchaseMembership = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const membershipCost = 199;

    if (user.walletBalance < membershipCost) {
      return res.json({ success: false, message: "Insufficient wallet balance. Please add funds." });
    }

    // Deduct balance
    user.walletBalance -= membershipCost;

    // Add transaction
    user.transactions.push({
      type: 'debit',
      amount: membershipCost,
      date: new Date(),
      description: 'Membership Purchase - Neighbourhood (30 Days)'
    });

    // Update membership details
    user.isMember = true;
    user.membershipType = 'Neighbourhood';

    // Calculate expiry (30 days from now) defined as 30 * 24 * 60 * 60 * 1000 ms
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const currentExpiry = user.membershipExpiry ? new Date(user.membershipExpiry).getTime() : Date.now();

    // If already a member and not expired, extend. Otherwise, start from now.
    // Actually, simple logic: if expired or not member, start now. If valid, extend?
    // Let's keep it simple: always set 30 days from NOW for new purchase, or if extending, add to current expiry.
    // For this MVP, let's just set it to 30 days from NOW to handle re-subscriptions simply, 
    // OR if user is already active, extend their current expiry.

    if (user.membershipExpiry && new Date(user.membershipExpiry) > new Date()) {
      user.membershipExpiry = new Date(new Date(user.membershipExpiry).getTime() + thirtyDaysInMs);
    } else {
      user.membershipExpiry = new Date(Date.now() + thirtyDaysInMs);
    }

    await user.save();

    res.json({ success: true, message: "Membership activated successfully!", user });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// API to Renew Request
const renewRequest = async (req, res) => {
  try {
    const { requestId, duration } = req.body;
    const userId = req.userId;

    if (!requestId || !duration) {
      return res.json({ success: false, message: "Missing details" });
    }

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.userId !== userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    if (request.status !== 'active' && request.status !== 'approved') {
      return res.json({ success: false, message: "Can only renew active requests" });
    }

    // Check item availability (simplified for now - just check basics)
    const item = await itemModel.findById(request.itemId);
    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    // Calculate new end date
    const currentEndDate = request.endDate; // Timestamp
    const additionalTime = duration * 24 * 60 * 60 * 1000;
    const newEndDate = currentEndDate + additionalTime;

    // Renewals are free for now
    const renewalCost = 0;

    request.renewals.push({
      date: Date.now(),
      duration: Number(duration),
      amount: renewalCost
    });

    request.endDate = newEndDate;
    request.duration += Number(duration);

    await request.save();

    res.json({ success: true, message: "Request renewed successfully", request });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Tip and Rate Owner
const tipAndRateOwner = async (req, res) => {
  try {
    const { requestId, tipAmount, rating } = req.body;
    const userId = req.userId;

    if (!requestId || !rating) {
      return res.json({ success: false, message: "Missing details" });
    }

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.userId !== userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    if (request.isRated) {
      return res.json({ success: false, message: "Already rated this transaction" });
    }

    // Tipping Logic
    if (tipAmount && tipAmount > 0) {
      const tipper = await userModel.findById(userId);
      if (tipper.walletBalance < tipAmount) {
        return res.json({ success: false, message: "Insufficient wallet balance for tip" });
      }

      const item = await itemModel.findById(request.itemId);
      const owner = await userModel.findById(item.owner);

      // Debit Tipper
      tipper.walletBalance -= Number(tipAmount);
      tipper.transactions.push({
        type: 'debit',
        amount: Number(tipAmount),
        date: new Date(),
        description: `Tip for ${item.name}`
      });
      await tipper.save();

      // Credit Owner
      if (owner) {
        owner.walletBalance += Number(tipAmount);
        owner.transactions.push({
          type: 'credit',
          amount: Number(tipAmount),
          date: new Date(),
          description: `Received tip for ${item.name}`
        });
        await owner.save();
      }
    }

    // Rating Logic (Karma)
    const itemForOwner = await itemModel.findById(request.itemId);
    const ownerToRate = await userModel.findById(itemForOwner.owner);

    if (ownerToRate) {
      if (rating === 'positive') {
        ownerToRate.karma.positive += 1;
      } else if (rating === 'negative') {
        ownerToRate.karma.negative += 1;
      }
      await ownerToRate.save();
    }

    request.isRated = true;
    request.tipAmount = tipAmount || 0;
    request.ratingType = rating;
    await request.save();

    res.json({ success: true, message: "Owner rated and tipped successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Request to Purchase an Item
const requestPurchase = async (req, res) => {
  try {
    const { itemId, offerPrice } = req.body;
    const userId = req.userId;

    const itemData = await itemModel.findById(itemId).populate('owner');
    if (!itemData) {
      return res.json({ success: false, message: 'Item not found' });
    }

    // Check if user already owns it
    if (itemData.owner._id.toString() === userId) {
      return res.json({ success: false, message: "You cannot buy your own item" });
    }

    if (itemData.sold) {
      return res.json({ success: false, message: 'Item is already sold' });
    }

    const userData = await userModel.findById(userId).select('-password');

    const newRequest = new requestModel({
      userId,
      itemId,
      userData,
      itemData,
      type: 'buy',
      offerPrice: Number(offerPrice),
      amount: 0, // No deposit for purchase requests initially
      startDate: Date.now(),
      endDate: Date.now(), // Irrelevant for buy
      duration: 0,
      date: Date.now()
    });

    await newRequest.save();

    res.json({ success: true, message: 'Purchase offer sent successfully!' });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Complete Purchase (After Approval)
const completePurchase = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    const request = await requestModel.findById(requestId);
    if (!request || request.type !== 'buy') {
      return res.json({ success: false, message: "Invalid purchase request" });
    }

    if (request.status !== 'approved') {
      return res.json({ success: false, message: "Request must be approved by owner first" });
    }

    if (request.userId !== userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const price = request.offerPrice;
    const buyer = await userModel.findById(userId);

    if (buyer.walletBalance < price) {
      return res.json({ success: false, message: "Insufficient wallet balance" });
    }

    const item = await itemModel.findById(request.itemId);
    if (!item || item.sold) {
      return res.json({ success: false, message: "Item is no longer available" });
    }

    const ownerId = item.owner;

    // Process Transaction
    // 1. Deduct from Buyer
    buyer.walletBalance -= price;
    buyer.transactions.push({
      type: 'debit',
      amount: price,
      date: new Date(),
      description: `Purchased item: ${item.name}`
    });
    await buyer.save();

    // 2. Add to Seller (Owner)
    const seller = await userModel.findById(ownerId);
    if (seller) {
      seller.walletBalance += price;
      seller.transactions.push({
        type: 'credit',
        amount: price,
        date: new Date(),
        description: `Sold item: ${item.name}`
      });
      await seller.save();
    }

    // 3. Update Item Ownership & Status
    item.sold = true;
    item.available = false; // Mark as unavailable since it's sold
    // We optionally transfer ownership here or keep 'sold' flag. 
    // Let's transfer ownership to buyer but keep 'sold' true so it shows as a purchase.
    // However, existing logic uses 'sold' to disable buttons.
    // If we transfer owner, it appears in Buyer's "My Items".
    item.owner = buyer._id;
    item.address = buyer.address || item.address; // Update location
    await item.save();

    // 4. Update Request Status
    request.status = 'completed';
    request.isCompleted = true;
    await request.save();

    res.json({ success: true, message: "Purchase completed! You now own this item." });

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
  uploadProfileImage,
  requestItem,
  listRequests,
  cancelRequest,
  listIncomingRequests,
  updateRequestStatus,
  getWallet,
  addFunds,
  buyItem,
  purchaseMembership,
  renewRequest,
  tipAndRateOwner,
  requestPurchase,
  completePurchase
};

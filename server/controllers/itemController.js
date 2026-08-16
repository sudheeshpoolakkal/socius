import itemModel from "../models/itemModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';

// API to add a new item
const addItem = async (req, res) => {
  try {
    const { name, category, description, address, deposit, price, isBuyable, isBorrowable } = req.body;
    const imageFile = req.file;
    const owner = req.userId; // Middleware adds this

    if (!name || !category || !description || !address || !deposit || !imageFile) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    // Parse address if it comes as a stringified object (due to FormData limitations)
    let parsedAddress = address;
    try {
      if (typeof address === 'string' && (address.startsWith('{') || address.startsWith('['))) {
        parsedAddress = JSON.parse(address);
      }
    } catch (e) {
      // Keep as string if parsing fails
    }

    const itemData = {
      name,
      category,
      description,
      image: imageUrl,
      owner,
      address: parsedAddress,
      deposit: Number(deposit),
      price: price ? Number(price) : undefined,
      isBuyable: isBuyable === 'true' || isBuyable === true,
      isBorrowable: isBorrowable === 'true' || isBorrowable === true,
      available: true,
      date: Date.now()
    };

    const newItem = new itemModel(itemData);
    await newItem.save();

    res.json({ success: true, message: "Item Added Successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to list all items
const listItem = async (req, res) => {
  try {
    const items = await itemModel.find({}).populate('owner', 'name image'); // Populate owner details
    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get single item by ID
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await itemModel.findById(itemId).populate('owner', 'name image');

    if (!item) {
      return res.json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId; // From middleware

    const item = await itemModel.findById(itemId);

    if (!item) return res.json({ success: false, message: 'Item not found' });

    // Check ownership
    if (item.owner.toString() !== userId) {
      return res.json({ success: false, message: 'Not authorized' });
    }

    await itemModel.findByIdAndUpdate(itemId, { available: !item.available });
    res.json({ success: true, message: 'Availability updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

export { addItem, listItem, getItemById, toggleAvailability };
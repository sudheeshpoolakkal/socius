import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // Replaces 'about'
  category: { type: String, required: true }, // Replaces 'speciality'
  image: { type: String, required: true },

  // Ownership & Location
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Who owns this item?
  address: { type: Object, required: true }, // {line1, line2} - usually matches owner's address

  // Borrowing Details
  deposit: { type: Number, required: true }, // Refundable deposit amount (Replaces fees)
  available: { type: Boolean, default: true },

  // Meta
  date: { type: Number, required: true },
  // Slots
  slots_booked: { type: Object, default: {} }, // Keep for now to manage availability dates

  // Sale Details
  price: { type: Number }, // Selling Price
  isBuyable: { type: Boolean, default: false }, // Is it for sale?
  isBorrowable: { type: Boolean, default: true }, // Is it for rent?
  sold: { type: Boolean, default: false } // Has it been sold?
}, { minimize: false })

const itemModel = mongoose.models.item || mongoose.model("item", itemSchema);
export default itemModel;
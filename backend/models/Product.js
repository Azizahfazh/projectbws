const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Basic Manicure & Pedicure",
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Non-Active"],
    default: "Active",
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number, // harga awal jika Promo
  },
  images: {
    type: [String], // array path gambar
    default: [],
  },
  tags: {
    type: [String], // array tag: Promo, Best Seller, New
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

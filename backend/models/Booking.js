const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String }, // <-- tambahkan ini
  phone: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  snapToken: { type: String },
  orderId: { type: String },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

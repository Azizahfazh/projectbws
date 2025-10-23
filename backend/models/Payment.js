const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  transactionId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  grossAmount: { type: Number, required: true },
  paymentType: { type: String },
  transactionTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

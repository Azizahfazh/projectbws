const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { core } = require("../config/midtrans"); // pastikan config midtrans sudah benar

exports.midtransNotification = async (req, res) => {
  try {
    // Parsing raw body dari Midtrans
    let notif;
    try {
      notif = JSON.parse(req.body.toString());
      console.log("Webhook masuk:", notif);
    } catch (parseErr) {
      console.error("Gagal parse body:", parseErr);
      return res.status(400).send("Invalid JSON");
    }

    // Validasi payload dengan Core API Midtrans
    let statusResponse;
    try {
      statusResponse = await core.transaction.notification(notif);
      console.log("Status dari Core API:", statusResponse);
    } catch (coreErr) {
      console.error("Gagal memproses Core API:", coreErr);
      return res.status(400).send("Invalid payload / signature");
    }

    const {
      order_id: orderId,
      transaction_status,
      transaction_id,
      gross_amount,
      payment_type,
      transaction_time,
    } = statusResponse;

    if (!orderId) {
      console.error("Order ID tidak ditemukan di payload:", statusResponse);
      return res.status(400).send("Missing order_id");
    }

    // Cari booking terkait
    const booking = await Booking.findOne({ orderId });
    if (!booking) {
      console.log("Booking tidak ditemukan untuk orderId:", orderId);
      return res.status(404).send("Booking tidak ditemukan");
    }

    // Update status booking
    switch (transaction_status) {
      case "capture":
      case "settlement":
        booking.status = "paid";
        break;
      case "cancel":
      case "deny":
      case "expire":
        booking.status = "failed";
        break;
      case "pending":
      default:
        booking.status = "pending";
        break;
    }

    await booking.save();
    console.log(`Booking ${orderId} status updated to ${booking.status}`);

    // Buat atau update Payment record
    let payment = await Payment.findOne({ transactionId: transaction_id });
    if (!payment) {
      payment = await Payment.create({
        bookingId: booking._id,
        transactionId: transaction_id,
        status: booking.status,
        grossAmount: gross_amount,
        paymentType: payment_type,
        transactionTime: transaction_time,
      });
    } else {
      payment.status = booking.status;
      await payment.save();
    }

    console.log(`Payment ${transaction_id} status saved as ${payment.status}`);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error webhook Midtrans:", err);
    res.status(500).send("Server Error");
  }
};

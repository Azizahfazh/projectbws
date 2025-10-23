const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const midtransClient = require("midtrans-client");

// ================================
// Inisialisasi Midtrans Snap & Core
// ================================
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// ================================
// POST /api/bookings — Buat booking baru + Snap token
// ================================
router.post("/", async (req, res) => {
  try {
    const { productId, productName, name, phone, address, note, date, time, price, email } = req.body;

    if (!productId || !productName || !name || !phone || !address || !date || !time || !price) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    // Cek slot sudah dibooking belum
    const slotTaken = await Booking.findOne({
      productId,
      date,
      time,
      status: { $in: ["pending", "paid"] },
    });
    if (slotTaken) return res.status(400).json({ error: "Slot waktu sudah dibooking" });

    const orderId = `BOOK-${Date.now()}`;

    const newBooking = await Booking.create({
      productId,
      productName,
      name,
      email: email || "", // simpan email jika dikirim dari frontend
      phone,
      address,
      note: note || "",
      date,
      time,
      price,
      orderId,
      status: "pending",
    });

    // Parameter untuk Midtrans
    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: Number(price) },
      customer_details: { first_name: name, email, phone },
    };

    const transaction = await snap.createTransaction(parameter);
    newBooking.snapToken = transaction.token;
    await newBooking.save();

    res.status(201).json({
      message: "Booking berhasil dibuat",
      booking: newBooking,
      snapToken: transaction.token,
    });
  } catch (err) {
    console.error("Error membuat booking:", err);
    res.status(500).json({ error: "Gagal membuat booking" });
  }
});

// ================================
// POST /api/bookings/notification — Webhook Midtrans
// ================================
router.post("/notification", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const notif = JSON.parse(req.body.toString());
    console.log("Webhook diterima:", notif);

    const statusResponse = await core.transaction.notification(notif);
    const {
      order_id: orderId,
      transaction_status,
      transaction_id,
      gross_amount,
      payment_type,
      transaction_time,
    } = statusResponse;

    const booking = await Booking.findOne({ orderId });
    if (!booking) {
      console.log("Booking tidak ditemukan:", orderId);
      return res.status(404).send("Booking tidak ditemukan");
    }

    // Update status booking berdasarkan status Midtrans
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

    // Simpan / update Payment record
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

    console.log(`Booking ${orderId} status updated to ${booking.status}`);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error webhook Midtrans:", err);
    res.status(500).send("Error");
  }
});

// ================================
// GET /api/bookings — Ambil slot yang sudah dibooking
// ================================
router.get("/", async (req, res) => {
  try {
    const { productId, date } = req.query;
    if (!productId || !date) return res.json([]);

    const bookings = await Booking.find({
      productId,
      date,
      status: { $in: ["pending", "paid"] },
    });

    const bookedTimes = bookings.map((b) => b.time);
    res.json(bookedTimes);
  } catch (err) {
    console.error("Error mengambil slot:", err);
    res.status(500).json([]);
  }
});

// ================================
// GET /api/bookings/mybookings — Ambil semua booking user
// ================================
router.get("/mybookings", async (req, res) => {
  try {
    const { email } = req.query; // ambil email dari query
    if (!email) return res.status(400).json({ error: "Email diperlukan" });

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error mengambil daftar booking user:", err);
    res.status(500).json({ error: "Gagal mengambil daftar booking" });
  }
});

module.exports = router;

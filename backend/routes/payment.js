// routes/payment.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const midtransClient = require("midtrans-client");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// ==========================
// BUAT BOOKING + SNAP TOKEN SEKALIGUS
// ==========================
router.post("/create", async (req, res) => {
  try {
    const { productId, productName, name, phone, address, note, date, time, price } = req.body;

    if (!productId || !productName || !name || !phone || !address || !date || !time || !price) {
      return res.status(400).json({ error: "Data booking tidak lengkap" });
    }

    // 1️⃣ Simpan booking dulu
    const orderId = `ORDER-${Date.now()}`;
    const booking = await Booking.create({
      productId,
      productName,
      name,
      phone,
      address,
      note,
      date,
      time,
      price,
      orderId,
      status: "pending",
    });

    // 2️⃣ Generate Snap token
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: name,
        phone,
        address,
      },
      item_details: [
        {
          id: productId,
          price,
          quantity: 1,
          name: productName,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    res.status(200).json({ snapToken, bookingId: booking._id });
  } catch (err) {
    console.error("❌ Error create booking + Snap:", err);
    res.status(500).json({ error: "Gagal membuat booking / transaksi" });
  }
});

// ==========================
// MIDTRANS NOTIFICATION WEBHOOK
// ==========================
router.post("/notification", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const payload = req.body.toString("utf8");
    const data = JSON.parse(payload);
    console.log("📩 Webhook diterima:", data);

    // Validasi signature
    const signature = crypto
      .createHash("sha512")
      .update(data.order_id + data.status_code + data.gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest("hex");

    if (signature !== data.signature_key) {
      console.log("⚠️ Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    // Cari booking
    const booking = await Booking.findOne({ orderId: data.order_id });
    if (!booking) return res.status(404).send("Booking tidak ditemukan");

    // Update status booking
    switch (data.transaction_status) {
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

    // Simpan / update payment
    let payment = await Payment.findOne({ transactionId: data.transaction_id });
    if (!payment) {
      payment = await Payment.create({
        bookingId: booking._id,
        transactionId: data.transaction_id,
        status: booking.status,
        grossAmount: data.gross_amount,
        paymentType: data.payment_type,
        transactionTime: data.transaction_time,
      });
    } else {
      payment.status = booking.status;
      await payment.save();
    }

    console.log(`✅ Booking ${booking.orderId} diperbarui ke status: ${booking.status}`);
    res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 Error processing webhook:", err);
    res.status(500).send("Error");
  }
});

module.exports = router;

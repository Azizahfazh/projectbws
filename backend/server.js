require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ===== Connect to MongoDB =====
connectDB();

// ===== Middleware =====
app.use(cors());

// Hanya route biasa yang pakai JSON parser
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/bookings/notification') || req.originalUrl.startsWith('/api/payment/notification')) {
    next(); // biarkan raw untuk Midtrans
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

// ===== Public folder untuk gambar =====
app.use('/uploads', express.static('uploads'));

// ===== Test route =====
app.get('/', (req, res) => res.send('Backend HYNailArt running 🚀'));

// ===== Routes =====
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes); // route notification

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

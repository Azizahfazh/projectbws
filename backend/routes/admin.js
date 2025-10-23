const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Booking = require("../models/Booking");

// ================================
// Setup multer untuk upload file
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================================
// REGISTER ADMIN
// ================================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.json({ message: "Admin berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal register admin" });
  }
});

// ================================
// LOGIN ADMIN
// ================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Data login diterima:", email, password);

    const admin = await Admin.findOne({ email });
    console.log("Admin ditemukan:", admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    console.log("Password cocok?", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign({ id: admin._id }, "secretkey", { expiresIn: "1d" });
    res.json({
      message: "Login berhasil",
      user: { id: admin._id, email: admin.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal login admin" });
  }
});

// ================================
// CRUD PRODUK
// ================================
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, status } = req.body;
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({ name, price, description, image, status });
    await newProduct.save();

    res.json({ message: "Produk berhasil ditambahkan", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan produk" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, status } = req.body;
    const updateData = { name, price, description, status };
    if (req.file) updateData.image = req.file.filename;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Produk berhasil diupdate", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update produk" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
});

// ================================
// BOOKING MANAGEMENT (ADMIN)
// ================================
router.get("/bookings", async (req, res) => {
  try {
    const { date, productId, status, search } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (productId) filter.productId = productId;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const bookings = await Booking.find(filter)
      .populate("productId", "name price")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      name: b.name,
      phone: b.phone,
      address: b.address,
      note: b.note,
      date: b.date,
      time: b.time,
      price: b.price,
      status: b.status,
      productName: b.productId?.name || b.productName || "Produk tidak ditemukan",
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data booking" });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Status booking berhasil diupdate", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update status booking" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }
    res.json({ message: "Booking berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus booking" });
  }
});

router.get("/total-pemasukan", async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const total = result[0]?.total || 0;
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghitung total pemasukan" });
  }
});

module.exports = router;

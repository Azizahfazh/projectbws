const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, originalPrice, description, status, category, tags } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    const images = req.files.map(file => "/uploads/" + file.filename);
    const product = new Product({
      name,
      price,
      originalPrice,
      description,
      status,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? tags.includes(",")
            ? tags.split(",").map(t => t.trim())
            : [tags]
          : [],
      images,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit product
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, originalPrice, description, status, category, tags } = req.body;
    const images = req.files.length > 0 ? req.files.map(f => "/uploads/" + f.filename) : undefined;
    const updateData = {
      name,
      price,
      originalPrice,
      description,
      status,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? tags.includes(",")
            ? tags.split(",").map(t => t.trim())
            : [tags]
          : [],
    };
    if (images) updateData.images = images;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produk dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

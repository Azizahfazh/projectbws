const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi' });

  try {
    const admin = await User.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Email tidak ditemukan' });
    if (admin.role !== 'admin') return res.status(403).json({ message: 'Bukan akun admin' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login admin berhasil',
      token,
      user: { username: admin.username, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Contoh endpoint dashboard admin
exports.dashboard = async (req, res) => {
  res.json({ message: 'Selamat datang di dashboard admin', admin: req.user });
};

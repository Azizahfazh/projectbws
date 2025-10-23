const midtransClient = require('midtrans-client');

// Snap client
const snap = new midtransClient.Snap({
  isProduction: false, // ubah ke true jika live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Core API client (untuk cek status transaksi)
const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

module.exports = { snap, core };

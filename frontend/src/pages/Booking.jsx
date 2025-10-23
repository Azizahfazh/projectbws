import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Booking = ({ user }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    date: "",
    time: ""
  });
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [step, setStep] = useState(1);
  const [snapReady, setSnapReady] = useState(false);
  const [loadingBooked, setLoadingBooked] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const timeOptions = ["09:00", "11:00", "13:30", "15:30", "17:00", "19:00"];

  // Load product & Midtrans Snap.js
  useEffect(() => {
    axios.get(`${API_URL.replace("/api", "")}/api/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => {
        toast.error("Produk tidak ditemukan");
        navigate("/katalog");
      });

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [productId, navigate]);

  // Set user info ke form
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.username, email: user.email }));
    }
  }, [user]);

  // Fetch booked times dari DB
  useEffect(() => {
    if (!form.date) {
      setBookedTimes([]);
      return;
    }

    setLoadingBooked(true);
    axios.get(`${API_URL}/bookings?productId=${productId}&date=${form.date}`)
      .then(res => {
        const booked = res.data.map(b => b.time.trim().slice(0,5));
        setBookedTimes(booked);
      })
      .catch(() => setBookedTimes([]))
      .finally(() => setLoadingBooked(false));
  }, [form.date, productId, API_URL]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTimeSelect = time => setForm({ ...form, time });

  const nextStep = () => {
    if (step === 1 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim())) {
      toast.error("Nama, Email, No HP, dan Alamat wajib diisi!");
      return;
    }
    if (step === 2 && (!form.date || !form.time)) {
      toast.error("Tanggal dan Jam wajib dipilih!");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleConfirmPayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.date || !form.time) {
      toast.error("Semua field wajib diisi kecuali Catatan!");
      return;
    }
    if (!snapReady) {
      toast.error("Midtrans Snap belum siap, tunggu sebentar...");
      return;
    }

    setLoading(true);
    try {
      const payload = { productId: product._id, productName: product.name, price: product.price, ...form };
      const res = await axios.post(`${API_URL}/bookings`, payload);
      const snapToken = res.data.snapToken;

      if (!snapToken) {
        toast.error("Snap token gagal dibuat. Coba lagi.");
        setLoading(false);
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil! Status akan diperbarui otomatis via webhook.");
          navigate("/mybookings");
        },
        onPending: () => {
          toast("Booking pending, selesaikan pembayaran di Midtrans. Status akan diperbarui via webhook.", { icon: "⏳" });
          navigate("/mybookings");
        },
        onError: () => toast.error("Terjadi kesalahan saat pembayaran."),
        onClose: () => toast("Popup ditutup tanpa menyelesaikan pembayaran.", { icon: "⚠️" }),
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking gagal!");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="relative flex flex-col items-center p-6">
      <Toaster position="top-right" />

      {/* Judul & Deskripsi */}
      <div className="max-w-xl mb-10 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-pink-600">
          Booking Jadwal Nail Art Kamu Sekarang
        </h1>
        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          Isi data diri kamu, pilih tanggal dan jam yang sesuai, lalu lakukan pembayaran
          dengan mudah dan aman.
        </p>
      </div>

      {/* Form Card */}
      <div className="flex flex-col w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl">
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {["Data Diri", "Tanggal & Jam", "Ringkasan"].map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-full font-bold flex items-center justify-center text-white ${
                  step === i + 1
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 scale-110 shadow-lg"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </div>
              <p className={`mt-1 text-sm font-medium ${step === i + 1 ? "text-pink-600" : "text-gray-500"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input name="email" placeholder="Email" value={form.email} readOnly className="p-3 bg-gray-100 border cursor-not-allowed rounded-xl" />
            <input name="phone" placeholder="No HP" value={form.phone} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input name="address" placeholder="Alamat" value={form.address} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <textarea name="note" placeholder="Catatan (opsional)" value={form.note} onChange={handleChange} className="h-20 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <input type="date" name="date" value={form.date} onChange={handleChange} min={today} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />

            {!form.date ? (
              <p className="text-sm text-gray-500">Pilih tanggal terlebih dahulu</p>
            ) : loadingBooked ? (
              <p className="text-sm text-gray-500">Loading booked times...</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 mt-2">
                {timeOptions.map(time => {
                  const isBooked = bookedTimes.includes(time);
                  const isSelected = form.time === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => { if (!isBooked) handleTimeSelect(time); }}
                      disabled={isBooked}
                      className={`py-3 rounded-2xl font-semibold transition-transform duration-200
                        ${isBooked
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
                          : isSelected
                            ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white scale-105 shadow-lg"
                            : "bg-pink-200 text-gray-700 hover:bg-gradient-to-r hover:from-pink-400 hover:to-pink-500 hover:text-white hover:scale-105"
                        }`}
                    >
                      {time} {isBooked ? "(Penuh)" : ""}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="p-4 shadow-inner bg-gray-50 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-center text-gray-800">Ringkasan Booking</h3>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <p className="font-medium">Nama:</p><p>{form.name}</p>
              <p className="font-medium">Email:</p><p>{form.email}</p>
              <p className="font-medium">No. HP:</p><p>{form.phone}</p>
              <p className="font-medium">Produk:</p><p>{product.name}</p>
              <p className="font-medium">Harga:</p><p>Rp {product.price.toLocaleString()}</p>
              <p className="font-medium">Tanggal:</p><p>{form.date}</p>
              <p className="font-medium">Jam:</p><p>{form.time}</p>
              {form.note && <><p className="font-medium">Catatan:</p><p>{form.note}</p></>}
            </div>
          </div>
        )}

        {/* Tombol navigasi */}
        <div className="flex justify-between gap-4 mt-6">
          {step > 1 && <button type="button" onClick={prevStep} className="flex-1 py-3 font-semibold border rounded-2xl hover:bg-gray-100">Kembali</button>}
          {step < 3 && <button type="button" onClick={nextStep} className="flex-1 py-3 font-semibold text-white rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 hover:opacity-90">Lanjut</button>}
          {step === 3 && <button type="button" onClick={handleConfirmPayment} className="flex-1 py-3 font-semibold text-white rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 hover:opacity-90">{loading ? "Loading..." : "Bayar & Booking"}</button>}
        </div>
      </div>
    </div>
  );
};

export default Booking;

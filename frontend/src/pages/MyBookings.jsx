import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FaRegCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStickyNote,
} from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      toast.error("Kamu harus login untuk melihat booking kamu");
      return;
    }
    fetchBookings(user.email);
  }, []);

  const fetchBookings = async (email) => {
    try {
      const res = await axios.get(`${API_URL}/bookings/mybookings?email=${email}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data booking");
    }
  };

  const handleContinuePayment = (snapToken) => {
    if (!window.snap) {
      toast.error("Midtrans Snap belum siap");
      return;
    }
    window.snap.pay(snapToken, {
      onSuccess: () => {
        toast.success("Pembayaran berhasil!");
        const user = JSON.parse(localStorage.getItem("user"));
        fetchBookings(user.email);
      },
      onPending: () => toast("Menunggu pembayaran..."),
      onError: () => toast.error("Pembayaran gagal."),
    });
  };

  const handleDownloadInvoice = async (booking) => {
    setDownloading(true);
    const element = document.getElementById(`invoice-pdf-${booking._id}`);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${booking._id}.pdf`);
      toast.success("Invoice berhasil diunduh!");
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
      toast.error("Gagal mengunduh invoice");
    }
    setDownloading(false);
  };

  const toggleBookingDetail = (bookingId) => {
    setActiveBookingId(activeBookingId === bookingId ? null : bookingId);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 md:px-16">
      <Toaster position="top-right" />
      <h1 className="mb-10 text-3xl font-bold text-center text-pink-600">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada booking yang dibuat.</p>
      ) : (
        <div className="flex flex-col space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="w-full overflow-hidden bg-white border shadow-md rounded-xl"
            >
              {/* Header Booking */}
              <div
                className="flex flex-col items-start justify-between p-6 transition cursor-pointer md:flex-row hover:bg-gray-100"
                onClick={() => toggleBookingDetail(booking._id)}
              >
                <div className="flex-1 w-full md:w-2/3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {booking.productName}
                  </h2>
                  <div className="flex flex-wrap items-center mt-1 space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaRegCalendarAlt /> <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock /> <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaMoneyBillWave />{" "}
                      <span>Rp{Number(booking.price).toLocaleString()}</span>
                    </div>
                  </div>
                  <p
                    className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </p>
                </div>

                {/* Tombol */}
                <div className="flex flex-col w-full mt-4 space-y-2 md:mt-0 md:ml-6 md:w-auto">
                  {booking.status !== "paid" && booking.snapToken && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinuePayment(booking.snapToken);
                      }}
                      className="px-4 py-2 font-semibold text-white bg-pink-500 rounded-xl hover:bg-pink-600"
                    >
                      Lanjutkan Pembayaran
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadInvoice(booking);
                    }}
                    className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600"
                    disabled={downloading}
                  >
                    {downloading ? "Mengunduh..." : "Download Invoice"}
                  </button>
                </div>
              </div>

              {/* Detail Booking */}
              {activeBookingId === booking._id && (
                <div className="p-6 border-t bg-gradient-to-r from-pink-50 to-pink-100 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-pink-700">
                      Invoice Detail
                    </h3>
                    <span className="text-sm text-gray-500">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="my-2 border-t border-gray-300"></div>

                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FaUser /> <span><strong>Nama:</strong> {booking.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaUser /> <span><strong>Email:</strong> {booking.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaRegCalendarAlt /> <span><strong>Tanggal:</strong> {booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock /> <span><strong>Jam:</strong> {booking.time}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FaMoneyBillWave /> <span><strong>Harga:</strong> Rp{Number(booking.price).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt /> <span><strong>Alamat:</strong> {booking.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhoneAlt /> <span><strong>Telepon:</strong> {booking.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaStickyNote /> <span><strong>Catatan:</strong> {booking.note || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-300"></div>

                  <div className="flex justify-end">
                    <span className="text-lg font-bold text-pink-700">
                      Total: Rp{Number(booking.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Offscreen PDF Invoice tanpa pajak */}
              <div
                id={`invoice-pdf-${booking._id}`}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "0",
                  width: "800px",
                  backgroundColor: "white",
                  padding: "30px",
                  display: "block",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ color: "#db2777", fontSize: "28px", margin: 0 }}>HYNailart</h2>
                    <p style={{ margin: "5px 0 0 0" }}>Jl. Contoh No.123, Jakarta</p>
                    <p style={{ margin: "2px 0 0 0" }}>Email: hynailart@gmail.com</p>
                    <p style={{ margin: "2px 0 0 0" }}>Telp: 08123456789</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h3 style={{ margin: 0 }}>INVOICE</h3>
                    <p style={{ margin: "5px 0 0 0" }}>#{booking._id}</p>
                    <p style={{ margin: "2px 0 0 0" }}>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Billing Info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <strong>Billed To:</strong>
                    <p style={{ margin: "2px 0 0 0" }}>{booking.name}</p>
                    <p style={{ margin: "2px 0 0 0" }}>{booking.email}</p>
                    <p style={{ margin: "2px 0 0 0" }}>{booking.address}</p>
                    <p style={{ margin: "2px 0 0 0" }}>{booking.phone}</p>
                  </div>
                  <div>
                    <strong>Booking Info:</strong>
                    <p style={{ margin: "2px 0 0 0" }}>{booking.productName}</p>
                    <p style={{ margin: "2px 0 0 0" }}>Tanggal: {booking.date}</p>
                    <p style={{ margin: "2px 0 0 0" }}>Jam: {booking.time}</p>
                    <p style={{ margin: "2px 0 0 0" }}>Status: {booking.status.toUpperCase()}</p>
                  </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#fcd5ce", textAlign: "left" }}>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Produk</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tanggal</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Jam</th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.productName}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.date}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.time}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>Rp{Number(booking.price).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Summary tanpa pajak */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                  <div style={{ width: "300px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span>Subtotal</span>
                      <span>Rp{Number(booking.price).toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px" }}>
                      <span>Total</span>
                      <span>Rp{Number(booking.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: "center", color: "#555", fontSize: "12px" }}>
                  <p>Terima kasih telah menggunakan layanan <strong>HYNailart</strong>!</p>
                  <p>Harap simpan invoice ini untuk referensi Anda.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

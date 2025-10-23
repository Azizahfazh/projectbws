import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white bg-[#D37C6B]">
      {/* Header */}
      <div className="p-4 text-2xl font-bold text-center border-b border-[#c26c5d]">
        HYNailArt Admin
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/admin/dashboard"
          className="block py-2.5 px-4 rounded hover:bg-[#bf6b5b] transition"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/produk"
          className="block py-2.5 px-4 rounded hover:bg-[#bf6b5b] transition"
        >
          Katalog
        </Link>

        <Link
          to="/admin/booking"
          className="block py-2.5 px-4 rounded hover:bg-[#bf6b5b] transition"
        >
          Data Booking
        </Link>

        <Link
          to="/admin/payment"
          className="block py-2.5 px-4 rounded hover:bg-[#bf6b5b] transition"
        >
          Payment
        </Link>

        <Link
          to="/admin/pelanggan"
          className="block py-2.5 px-4 rounded hover:bg-[#bf6b5b] transition"
        >
          Data Pelanggan
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 text-sm text-center text-[#f9e6e2] border-t border-[#c26c5d]">
        © 2025 HYNailArt
      </div>
    </div>
  );
}

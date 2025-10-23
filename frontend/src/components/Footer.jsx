import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHandSparkles,
  FaClock,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-white bg-gradient-to-r from-pink-400 to-pink-500">
      <div className="grid grid-cols-1 gap-8 px-6 py-10 mx-auto max-w-7xl md:grid-cols-4">
        {/* Brand Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaHandSparkles size={24} className="mr-2" />
            <h2 className="text-2xl font-bold tracking-wide">HYNailArt</h2>
          </div>
          <p className="text-sm leading-relaxed text-pink-50">
            Sentuhan keindahan di setiap ujung jari.  
            Kami hadir untuk membuat kuku kamu berkilau penuh percaya diri ✨
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="mb-2 text-lg font-semibold">Quick Links</h3>
          <Link
            to="/"
            className="text-sm transition-colors duration-300 hover:text-pink-100"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm transition-colors duration-300 hover:text-pink-100"
          >
            About
          </Link>
          <Link
            to="/katalog"
            className="text-sm transition-colors duration-300 hover:text-pink-100"
          >
            Katalog
          </Link>
          <Link
            to="/mybookings"
            className="text-sm transition-colors duration-300 hover:text-pink-100"
          >
            MyBookings
          </Link>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm text-pink-50">
            <FaEnvelope /> hynailart6@gmail.com
          </p>
          <p className="flex items-center gap-2 text-sm text-pink-50">
            <FaPhoneAlt /> +62 812 3456 7890
          </p>
          <p className="flex items-center gap-2 text-sm text-pink-50">
            <FaMapMarkerAlt /> Jl. Anggrek No. 7, Karawang, Indonesia
          </p>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Opening Hours</h3>
          <p className="flex items-center gap-2 text-sm text-pink-50">
            <FaClock /> Setiap Hari: 09.00 WIB – 21.00 WIB
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-pink-300/40">
        <div className="flex flex-col items-center justify-between px-6 py-4 mx-auto space-y-4 max-w-7xl md:flex-row md:space-y-0">
          <p className="flex items-center gap-2 text-sm text-pink-50">
            <FaHandSparkles size={16} className="text-white" />
            &copy; {new Date().getFullYear()} HYNailArt. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="transition-transform duration-300 hover:scale-110"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="transition-transform duration-300 hover:scale-110"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="transition-transform duration-300 hover:scale-110"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

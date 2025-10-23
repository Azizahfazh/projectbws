import React, { useState } from "react";
import { FaHandSparkles, FaUserCircle } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { MdLogin } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSparkle, setIsSparkle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSparkle = () => {
    setIsSparkle(true);
    setTimeout(() => setIsSparkle(false), 1000);
  };

  // Menu utama
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Katalog", path: "/katalog" },
    { name: "My Bookings", path: "/mybookings" },
  ];

  // Fungsi navigasi dengan proteksi login
  const handleNavigate = (path) => {
    if (path === "/mybookings" && !user) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-pink-400 to-pink-500 shadow-md font-[Quicksand]">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => navigate("/")}
          onMouseEnter={toggleSparkle}
        >
          <div className="relative">
            <FaHandSparkles
              size={28}
              className="text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
            />
            {isSparkle && (
              <GiSparkles
                size={20}
                className="absolute text-yellow-200 animate-ping -top-2 -right-2"
              />
            )}
          </div>
          <span className="text-2xl font-bold tracking-wide text-white">
            HYNailArt
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="items-center hidden space-x-6 md:flex">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.path)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-white hover:bg-white/20 hover:text-white/90"
              }`}
            >
              {item.name}
            </button>
          ))}

          {/* User info / tombol login */}
          {user ? (
            <div className="flex items-center px-3 py-2 space-x-2 transition-all rounded-full bg-white/20 hover:bg-white/30">
              <FaUserCircle size={22} className="text-white" />
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full hover:bg-white/20"
            >
              <MdLogin size={20} className="mr-1" />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 transition-all rounded-md hover:bg-white/20"
          >
            {isOpen ? (
              <AiOutlineClose size={24} className="text-white" />
            ) : (
              <AiOutlineMenu size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-pink-500/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen py-3" : "max-h-0"
        }`}
      >
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                handleNavigate(item.path);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-white hover:bg-white/20 hover:text-white/90"
              }`}
            >
              {item.name}
            </button>
          ))}

          {user ? (
            <div className="flex items-center px-4 py-2 space-x-2 transition-all rounded-full bg-white/20 hover:bg-white/30">
              <FaUserCircle size={22} className="text-white" />
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm font-semibold text-left text-white transition-all duration-200 rounded-full hover:bg-white/20"
            >
              <MdLogin size={20} className="mr-1" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

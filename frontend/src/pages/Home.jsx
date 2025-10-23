import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/about-nailart.jpg"; // Ganti path sesuai lokasi gambar

const tagColors = {
  "BEST SELLER": "#FF6347",
  PROMO: "#32CD32",
  NEW: "#1E90FF",
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("BEST SELLER");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const formatCurrency = (value) =>
    Number(value).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

  const handleBooking = (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }
    navigate(`/booking/${productId}`);
  };

  const getLatestProductsByTag = (tag) => {
    return products
      .filter((p) => p.tags?.map((t) => t.toUpperCase()).includes(tag))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  const tags = ["BEST SELLER", "PROMO", "NEW"];

  return (
    <div className="font-[Quicksand]">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[60vh] -mt-0 md:-mt-4 text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {/* Konten Hero */}
        <div className="relative px-6 text-center">
          <h1 className="mb-3 text-3xl font-extrabold md:text-4xl">
            Nail Art Eksklusif & Trendy
          </h1>
          <p className="mb-4 text-sm md:text-base">
            Temukan desain nail art unik sesuai gaya dan kepribadianmu
          </p>
          <button
            onClick={() => navigate("/katalog")}
            className="px-4 py-2 text-sm font-semibold text-white transition bg-pink-600 rounded-full shadow-lg md:text-base hover:bg-pink-700"
          >
            Lihat Katalog
          </button>
        </div>
      </section>

      {/* Filter Kategori */}
      <section className="py-8 bg-gray-50">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Pilih Kategori
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedTag === tag
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Produk Berdasarkan Filter */}
      <section className="px-6 py-12 mx-auto max-w-7xl">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
          {selectedTag.replace("_", " ")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {getLatestProductsByTag(selectedTag).length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              Belum ada produk di kategori ini.
            </p>
          ) : (
            getLatestProductsByTag(selectedTag).map((product) => (
              <div
                key={product._id}
                className="relative overflow-hidden transition-transform bg-white shadow-lg cursor-pointer rounded-xl hover:scale-105"
              >
                {/* Tag */}
                {product.tags?.length > 0 && (
                  <div className="absolute z-10 flex flex-wrap gap-1 p-2 top-2 left-2">
                    {product.tags.map((tag, idx) => {
                      const color =
                        tagColors[tag.toUpperCase()] || "#FF69B4";
                      return (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 6px ${color}`,
                          }}
                          className="px-2 py-1 text-xs font-bold text-white uppercase rounded-full animate-pulse"
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                <img
                  src={`${API_URL}${product.images[0]}`}
                  alt={product.name}
                  className="object-cover w-full h-56 transition-transform duration-500 hover:scale-110"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold tracking-wide text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-pink-600">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBooking(product._id)}
                    className="w-full px-4 py-2 mt-3 font-medium text-white transition-transform bg-pink-600 rounded-md hover:bg-pink-700 hover:-translate-y-1"
                  >
                    Booking Sekarang
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

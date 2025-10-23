import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "All",
  "Basic Manicure & Pedicure",
  "Gel Nails",
  "Acrylic Nails",
  "Nail Art / Decorative",
  "French / Classic Style",
  "Custom",
];

const tagColors = {
  "BEST SELLER": "#FF6347",
  PROMO: "#32CD32",
  NEW: "#1E90FF",
};

const Katalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
      }
    };
    fetchProducts();
  }, [API_URL]);

  useEffect(() => {
    if (selectedCategory === "All") setFilteredProducts(products);
    else
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
  }, [selectedCategory, products]);

  const formatCurrency = (value) =>
    Number(value).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

  const prevImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBooking = (e, productId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk melakukan booking!");
      navigate("/login");
      return;
    }
    navigate(`/booking/${productId}`);
  };

  return (
    <div className="max-w-7xl px-6 py-12 mx-auto font-[Quicksand]">
      {/* Judul Katalog */}
      <h1 className="mb-2 text-4xl font-extrabold tracking-wide text-center text-pink-600">
        Katalog Nail Art Terbaru
      </h1>
      <p className="mb-8 text-lg text-center text-gray-600">
        Temukan desain eksklusif sesuai gaya dan kepribadianmu
      </p>

      {/* Filter kategori */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            title={`Lihat koleksi ${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid produk / Tampilan kosong */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          {/* Ilustrasi */}
          <svg
            className="w-32 h-32 text-pink-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-6 4h6m-3-3v3m0-3V7"
            />
          </svg>

          {/* Teks utama */}
          <h2 className="text-2xl font-bold text-gray-700">
            Ups! Belum ada produk di kategori ini
          </h2>

          {/* Teks tambahan */}
          <p className="max-w-xs text-center text-gray-500">
            Kami sedang menyiapkan koleksi nail art terbaru untukmu. Sementara itu,
            coba lihat kategori lain atau kembali lagi nanti!
          </p>

          {/* Tombol kembali ke semua produk */}
          <button
            onClick={() => setSelectedCategory("All")}
            className="px-6 py-2 text-white transition-all bg-pink-600 rounded-full hover:bg-pink-700"
          >
            Lihat Semua Produk
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => {
                setSelectedProduct(product);
                setCurrentImageIndex(0);
              }}
              className="relative overflow-hidden transition-transform bg-white shadow-lg cursor-pointer rounded-xl hover:scale-105"
            >
              {/* Tag */}
              {product.tags?.length > 0 && (
                <div className="absolute flex flex-wrap gap-1 p-2">
                  {product.tags.map((tag, idx) => {
                    const color = tagColors[tag.toUpperCase()] || "#FF69B4";
                    return (
                      <span
                        key={idx}
                        style={{ backgroundColor: color }}
                        className="px-2 py-1 text-xs font-semibold text-white rounded-md"
                      >
                        {tag.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Gambar */}
              <img
                src={`${API_URL}${product.images[0]}`}
                alt={product.name}
                className="object-cover w-full h-56"
              />

              {/* Info Produk */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 line-clamp-2">
                  {product.description.length > 60
                    ? product.description.slice(0, 60) + "..."
                    : product.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-lg font-semibold text-pink-600">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <button
                  onClick={(e) => handleBooking(e, product._id)}
                  className="w-full px-4 py-2 mt-3 font-medium text-white transition bg-pink-600 rounded-md hover:bg-pink-700"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal produk */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full max-w-md bg-white shadow-lg rounded-xl"
          >
            {/* Tombol close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute z-10 text-3xl font-bold text-gray-500 top-2 right-4 hover:text-gray-700"
            >
              ×
            </button>

            {/* Gambar utama */}
            <div className="relative flex-shrink-0 w-full h-64 bg-gray-100 rounded-t-xl">
              {selectedProduct.images.length > 0 ? (
                <img
                  src={`${API_URL}${selectedProduct.images[currentImageIndex]}`}
                  alt={selectedProduct.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  Tidak ada gambar
                </div>
              )}

              {/* Navigasi gambar */}
              {selectedProduct.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute px-3 py-1 text-2xl font-bold text-white -translate-y-1/2 bg-black rounded-full bg-opacity-30 left-3 top-1/2 hover:bg-opacity-50"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute px-3 py-1 text-2xl font-bold text-white -translate-y-1/2 bg-black rounded-full bg-opacity-30 right-3 top-1/2 hover:bg-opacity-50"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail */}
            {selectedProduct.images.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 p-3 bg-gray-100">
                {selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                      currentImageIndex === index
                        ? "border-pink-600"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Info produk */}
            <div className="flex-1 p-5">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedProduct.name}
              </h2>
              <p className="mb-2 italic text-gray-500">
                {selectedProduct.category} – Desain eksklusif
              </p>

              <div className="flex items-center gap-2 mt-2">
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-gray-400 line-through">
                    {formatCurrency(selectedProduct.originalPrice)}
                  </span>
                )}
                <span className="text-lg font-semibold text-pink-600">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </div>

              {/* Scroll hanya di deskripsi */}
              <div className="pr-2 mt-3 overflow-y-auto leading-relaxed text-gray-700 break-words whitespace-normal max-h-40">
                {selectedProduct.description}
              </div>
            </div>

            {/* Tombol booking tetap di bawah */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={(e) => handleBooking(e, selectedProduct._id)}
                className="w-full px-4 py-2 font-medium text-white transition bg-pink-600 rounded-md hover:bg-pink-700"
              >
                Booking Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Katalog;

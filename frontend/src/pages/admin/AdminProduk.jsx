import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

// ============================
// Konstanta
// ============================
const categories = [
  "Basic Manicure & Pedicure",
  "Gel Nails",
  "Acrylic Nails",
  "Nail Art / Decorative",
  "French / Classic Style",
];

const tagOptions = ["Promo", "Best Seller", "New"];

const tagColors = {
  PROMO: "#bf6b5b",
  "BEST SELLER": "#D37C6B",
  NEW: "#c26c5d",
};

// ============================
// Komponen Utama
// ============================
const AdminProduk = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    originalPrice: "",
    description: "",
    status: "Active",
    tags: [],
    images: [],
  });

  // ============================
  // Lifecycle
  // ============================
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, products]);

  // ============================
  // Utility
  // ============================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const formatCurrency = (value) =>
    value
      ? Number(value).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
      : "-";

  const resetForm = () => {
    setForm({
      name: "",
      category: categories[0],
      price: "",
      originalPrice: "",
      description: "",
      status: "Active",
      tags: [],
      images: [],
    });
  };

  // ============================
  // CRUD Produk
  // ============================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
      showNotification("❌ Gagal mengambil produk!", "error");
    }
  };

  const handleAddOrEditProduct = async () => {
    if (!form.name || !form.description || !form.category) {
      showNotification("Nama, kategori, dan deskripsi wajib diisi!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("status", form.status);
    form.tags.forEach((tag) => formData.append("tags[]", tag));
    form.images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
    });
    if (form.price) formData.append("price", Number(form.price));
    formData.append(
      "originalPrice",
      form.tags.includes("Promo") && form.originalPrice
        ? Number(form.originalPrice)
        : ""
    );

    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/api/products/${editingProduct._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showNotification("✅ Produk berhasil diperbarui!");
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("✅ Produk berhasil ditambahkan!");
      }

      setAddingProduct(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      showNotification("❌ Gagal menyimpan produk!", "error");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category || categories[0],
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description,
      status: product.status,
      tags: product.tags || [],
      images: product.images || [],
    });
    setAddingProduct(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah yakin ingin menghapus produk ini?")) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      showNotification("✅ Produk berhasil dihapus!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showNotification("❌ Gagal menghapus produk!", "error");
    }
  };

  // ============================
  // Gambar & Search
  // ============================
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file && form.images.length < 5) {
      setForm({ ...form, images: [...form.images, file] });
    }
  };

  const handleRemoveImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSearch = (term) => {
    const query = term.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  // ============================
  // Render
  // ============================
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 min-h-screen p-6 ml-64 bg-[#f8ebe8]">
        <h2 className="mb-4 text-2xl font-bold text-[#8b4c3f]">Kelola Produk</h2>

        {/* Notifikasi */}
        {notification.message && (
          <div
            className={`mb-4 p-3 rounded ${
              notification.type === "success"
                ? "bg-[#bf6b5b] text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tombol Tambah + Search Bar */}
        {!addingProduct && (
          <div className="flex items-center justify-end gap-2 mb-6">
            <button
              onClick={() => {
                setAddingProduct(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded transition bg-[#D37C6B] hover:bg-[#bf6b5b]"
            >
              <FaPlus /> Tambah Produk
            </button>

            <div className="relative w-60">
              <FaSearch className="absolute text-gray-400 left-3 top-3" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D37C6B]"
              />
            </div>
          </div>
        )}

        {/* Form Tambah / Edit Produk */}
        {addingProduct && (
          <div className="p-6 mb-6 rounded shadow bg-[#f3dcd7]">
            <h3 className="mb-4 text-xl font-semibold text-[#8b4c3f]">
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama Produk"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 border rounded"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-2 border rounded"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="p-2 border rounded"
              />

              <input
                type="number"
                placeholder="Harga Awal (jika promo)"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({ ...form, originalPrice: e.target.value })
                }
                className="p-2 border rounded"
              />

              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="p-2 border rounded"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Non-Active">Non-Active</option>
              </select>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <label key={tag} className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={form.tags.includes(tag)}
                      onChange={() => {
                        const newTags = form.tags.includes(tag)
                          ? form.tags.filter((t) => t !== tag)
                          : [...form.tags, tag];
                        setForm({ ...form, tags: newTags });
                      }}
                    />
                    <span
                      className="px-2 py-1 text-xs text-white rounded"
                      style={{
                        backgroundColor: tagColors[tag.toUpperCase()],
                      }}
                    >
                      {tag.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>

              {/* Gambar */}
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 overflow-hidden border rounded"
                  >
                    <img
                      src={
                        img instanceof File
                          ? URL.createObjectURL(img)
                          : `${API_URL}${img}`
                      }
                      alt=""
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute w-5 h-5 text-xs text-white rounded-full -top-2 -right-2 bg-[#bf6b5b]"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {form.images.length < 5 && (
                  <label className="flex items-center justify-center w-24 h-24 text-xl text-gray-400 border border-dashed rounded cursor-pointer">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImage}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddOrEditProduct}
                  className="flex-1 p-2 text-white rounded transition bg-[#D37C6B] hover:bg-[#bf6b5b]"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 p-2 text-gray-700 bg-gray-300 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabel Produk */}
        {!addingProduct && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white bg-[#D37C6B]">
                <th className="p-2">Gambar</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Deskripsi</th>
                <th className="p-2">Status</th>
                <th className="p-2">Tags</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    Tidak ada produk yang cocok
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="h-16 border-b hover:bg-[#f6e4df]"
                  >
                    <td>
                      {p.images?.[0] && (
                        <img
                          src={`${API_URL}${p.images[0]}`}
                          alt=""
                          className="object-cover w-12 h-12 rounded"
                        />
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      {p.tags.includes("Promo") && p.originalPrice && (
                        <span className="mr-1 line-through">
                          {formatCurrency(p.originalPrice)}
                        </span>
                      )}
                      {formatCurrency(p.price)}
                    </td>
                    <td className="max-w-xs truncate">{p.description}</td>
                    <td>{p.status}</td>
                    <td>
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 mr-1 text-xs text-white rounded"
                          style={{
                            backgroundColor:
                              tagColors[tag.toUpperCase()] || "#ccc",
                          }}
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </td>
                    <td className="flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-white rounded bg-[#bf6b5b] hover:bg-[#a8574a]"
                        title="Edit Produk"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-white bg-red-400 rounded hover:bg-red-500"
                        title="Hapus Produk"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProduk;

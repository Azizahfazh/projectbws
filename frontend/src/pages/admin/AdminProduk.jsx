import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

const categories = [
  "Basic Manicure & Pedicure",
  "Gel Nails",
  "Acrylic Nails",
  "Nail Art / Decorative",
  "French / Classic Style",
  "Custom",
];

const tagOptions = ["Promo", "Best Seller", "New"];
const tagColors = {
  "BEST SELLER": "#FF6347",
  "PROMO": "#32CD32",
  "NEW": "#1E90FF",
};

const AdminProduk = () => {
  const [products, setProducts] = useState([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
  const [notification, setNotification] = useState({ message: "", type: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
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

    // hanya tambahkan originalPrice kalau Promo
    if (form.tags.includes("Promo") && form.originalPrice) {
      formData.append("originalPrice", Number(form.originalPrice));
    } else {
      formData.append("originalPrice", "");
    }

    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("✅ Produk berhasil diperbarui!", "success");
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("✅ Produk berhasil ditambahkan!", "success");
      }

      setAddingProduct(false);
      setEditingProduct(null);
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
      showNotification("✅ Produk berhasil dihapus!", "success");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showNotification("❌ Gagal menghapus produk!", "error");
    }
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file && form.images.length < 5) {
      setForm({ ...form, images: [...form.images, file] });
    }
  };

  const handleRemoveImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const formatCurrency = (value) =>
    value
      ? Number(value).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen p-6 ml-64 bg-blue-50">
        <h2 className="mb-4 text-2xl font-bold">Kelola Produk</h2>

        {notification.message && (
          <div
            className={`mb-4 p-3 rounded ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        {!addingProduct && (
          <button
            onClick={() => {
              setAddingProduct(true);
              setEditingProduct(null);
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
            }}
            className="px-5 py-2 mb-4 text-white transition bg-blue-400 rounded hover:bg-blue-500"
          >
            + Tambah Produk
          </button>
        )}

        {addingProduct && (
          <div className="p-6 mb-6 bg-blue-100 rounded shadow">
            <h3 className="mb-4 text-xl font-semibold">
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
                      className="px-2 py-1 text-white rounded"
                      style={{
                        backgroundColor: tagColors[tag.toUpperCase()] || "#ccc",
                        fontSize: "12px",
                      }}
                    >
                      {tag.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 overflow-hidden border rounded"
                  >
                    <img
                      src={
                        img instanceof File ? URL.createObjectURL(img) : `${API_URL}${img}`
                      }
                      alt=""
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
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
                  className="flex-1 p-2 text-white transition bg-blue-400 rounded hover:bg-blue-500"
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

        {!addingProduct && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white bg-blue-400">
                <th className="p-2">Gambar</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Deskripsi</th>
                <th className="p-2">Status</th>
                <th className="p-2">Tags</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="h-16 border-b">
                    <td>
                      {p.images && p.images[0] && (
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
                          className="px-2 py-1 mr-1 text-white rounded"
                          style={{
                            backgroundColor: tagColors[tag.toUpperCase()] || "#ccc",
                            fontSize: "12px",
                          }}
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1 mr-1 text-white bg-blue-300 rounded hover:bg-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1 text-white bg-red-400 rounded hover:bg-red-500"
                      >
                        Hapus
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

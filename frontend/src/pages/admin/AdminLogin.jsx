import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa"; // ikon admin

const AdminLogin = ({ onAdminLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );
      onAdminLogin(res.data.user, res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-2xl animate-fadeIn">
        {/* Ikon */}
        <div className="flex justify-center mb-4">
          <FaUserShield className="text-6xl text-pink-500" />
        </div>

        <h1 className="mb-8 text-4xl font-extrabold text-center text-pink-500">
          Admin Login
        </h1>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-4 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-4 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="p-4 font-bold text-white transition-colors bg-pink-500 rounded-xl hover:bg-pink-600"
          >
            Login
          </button>
          {error && <p className="text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

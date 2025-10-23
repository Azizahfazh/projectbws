import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      if (res.data && res.data.user) {
        setSuccess("Registrasi berhasil!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-3xl">
        <h1 className="text-2xl font-bold text-center text-pink-600">
          Bergabung dengan HYNailArt!
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="p-3 border rounded-xl focus:outline-pink-400 focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-xl focus:outline-pink-400 focus:ring-2 focus:ring-pink-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-pink-400 focus:ring-2 focus:ring-pink-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 top-3 right-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="p-3 font-semibold text-white transition bg-pink-500 rounded-xl hover:bg-pink-600"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-medium text-pink-500 hover:underline">
            Login di sini
          </Link>
        </p>

        {error && (
          <div className="flex items-center p-3 mt-2 space-x-2 text-red-700 bg-red-100 border border-red-300 shadow rounded-xl">
            <AiOutlineCloseCircle className="text-xl" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center p-3 mt-2 space-x-2 text-green-700 bg-green-100 border border-green-300 shadow rounded-xl">
            <AiOutlineCheckCircle className="text-xl" />
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

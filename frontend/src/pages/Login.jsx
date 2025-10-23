import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data && res.data.user && res.data.token) {
        // simpan token & user di localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // update state di App.jsx
        onLogin(res.data.user);

        setSuccess("Login berhasil!");
        const redirectPath = localStorage.getItem("redirectAfterLogin");

        setTimeout(() => {
          setSuccess("");
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        setError("Login gagal. Periksa email dan password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-pink-600">Selamat Datang!</h2>
          <p className="mt-2 text-gray-600">
            Silakan login untuk melanjutkan booking dan menikmati layanan HYNailArt.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 top-3 right-3 hover:text-pink-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="p-3 font-semibold text-white rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:opacity-90"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium text-pink-500 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>

        {error && (
          <div className="flex items-center p-3 mt-4 text-red-700 bg-red-100 border border-red-300 rounded-xl">
            <AiOutlineCloseCircle className="mr-2 text-xl" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center p-3 mt-4 text-green-700 bg-green-100 border border-green-300 rounded-xl">
            <AiOutlineCheckCircle className="mr-2 text-xl" />
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

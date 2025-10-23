import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages User
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Katalog from "./pages/Katalog";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

// Pages Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduk from "./pages/admin/AdminProduk";

const App = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const handleLogoutUser = () => setUser(null);
  const handleLogoutAdmin = () => setAdmin(null);

  // Layout untuk user
  const UserLayout = () => (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogoutUser} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  // Layout untuk admin
  const AdminLayout = () => (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );

  // Komponen wrapper untuk melindungi route Booking agar hanya bisa diakses oleh user yang sudah login
  const ProtectedRoute = ({ element }) => {
    const location = useLocation();
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register onRegister={setUser} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/katalog" element={<Katalog />} />

          {/* Booking harus login */}
          <Route
            path="/booking/:productId"
            element={<ProtectedRoute element={<Booking user={user} />} />}
          />

          <Route path="/mybookings" element={<MyBookings user={user} />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/login"
            element={
              admin ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <AdminLogin onAdminLogin={setAdmin} />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              admin ? (
                <AdminDashboard admin={admin} onLogout={handleLogoutAdmin} />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/produk"
            element={admin ? <AdminProduk /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/bookings"
            element={admin ? <div>Admin Bookings Page</div> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/users"
            element={admin ? <div>Admin Users Page</div> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/settings"
            element={admin ? <div>Admin Settings Page</div> : <Navigate to="/admin/login" />}
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

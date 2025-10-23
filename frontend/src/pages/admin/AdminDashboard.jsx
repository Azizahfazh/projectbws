import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen p-8 ml-64 bg-gray-50">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
        <p>Selamat datang di panel admin HYNailArt!</p>
      </div>
    </div>
  );
}

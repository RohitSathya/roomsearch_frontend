import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import AdminProperty from "./AdminProperty";
import Users from "./Users";
import ImageUploader from "./ImageUploader";
import AgentTab from "./AgentTab";
import ChartPage from "./ChartPage";
import link from "../link"; // Import ChartPage for the chart feature
import AdminFavPropertyList from "./AdminFavPropertyList";

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/charts");
  }, []);

  useEffect(() => {
    // Check if admin credentials are already saved in localStorage
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Simple check for hardcoded admin credentials
    if (username === "admin" && password === "admin") {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      navigate("/admin/charts");
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    navigate("/admin"); // Redirect to home or login page
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Admin Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter admin username"
                className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter admin password"
                className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 ml-64 p-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mb-4"
        >
          Logout
        </button>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="property" element={<AdminProperty />} />
          <Route path="users" element={<Users />} />
          <Route path="imlink" element={<ImageUploader />} />
          <Route path="agents" element={<AgentTab/>}></Route>
          <Route path="charts" element={<ChartPage />} /> {/* Chart Page */}
          <Route path="favorites" element={<AdminFavPropertyList />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;

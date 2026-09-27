import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import PickupRequest from "./pages/PickupRequest";
import RequestDetails from "./pages/RequestDetails";
import PickupHistory from "./pages/PickupHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRequestsList from "./pages/AdminRequestsList";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  if (!adminOnly && user.role === "ADMIN") return <Navigate to="/admin" replace />;

  return children;
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-warm-100 flex flex-col">
      <Navbar onMenuToggle={() => setSidebarOpen((s) => !s)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/new"
        element={
          <ProtectedRoute>
            <Layout>
              <PickupRequest />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout>
              <PickupHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminRequestsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests/:id"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <RequestDetails adminView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, PlusCircle, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-emerald-900/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user && (
            <button
              type="button"
              className="md:hidden p-2 text-darkforest hover:bg-warm-100 rounded-xl transition-colors"
              onClick={onMenuToggle}
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size="md" />
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Quick Action button for Users */}
            {user.role !== "ADMIN" && (
              <Link
                to="/requests/new"
                className="hidden sm:inline-flex items-center gap-1.5 bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-forest-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-forest-600" />
                Schedule Pickup
              </Link>
            )}

            {/* User profile identifier */}
            <div className="flex items-center gap-2 bg-warm-100/80 px-3 py-1.5 rounded-xl border border-emerald-900/5">
              <div className="w-7 h-7 rounded-lg bg-forest-700 text-white flex items-center justify-center text-xs font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-darkforest">{user.name}</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-forest-700 mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

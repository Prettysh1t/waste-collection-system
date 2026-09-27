import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  ClipboardList,
  BarChart3,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ open = false, onClose }) {
  const { user } = useAuth();

  const userLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/requests/new", label: "Schedule Pickup", icon: PlusCircle },
    { to: "/history", label: "Pickup History", icon: History },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard Overview", icon: BarChart3 },
    { to: "/admin/requests", label: "All Pickup Requests", icon: ClipboardList },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-darkforest/30 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`bg-white border-r border-emerald-900/10 w-64 shrink-0 transition-transform duration-200 z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:sticky top-[57px] md:top-0 left-0 h-[calc(100vh-57px)] md:h-screen flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          <div className="px-3 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800/60">
              {user?.role === "ADMIN" ? "Operations Workspace" : "Resident Portal"}
            </span>
          </div>

          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-forest-50 text-forest-800 font-semibold shadow-xs border border-forest-200"
                      : "text-gray-600 hover:text-darkforest hover:bg-warm-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? "text-forest-600" : "text-gray-400"}`} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Environmental Inspiration Card at bottom of sidebar */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-forest-50 to-warm-100 border border-forest-200/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-forest-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Eco Impact</span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            "Small responsible actions create a cleaner planet."
          </p>
          <div className="mt-2 text-[10px] text-forest-700 font-semibold flex items-center gap-1">
            <span>🌱</span> WasteCare Community
          </div>
        </div>
      </aside>
    </>
  );
}

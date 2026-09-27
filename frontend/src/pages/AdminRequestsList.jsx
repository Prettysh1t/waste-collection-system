import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { getAllRequestsAdmin, getCategories } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function AdminRequestsList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "", category: "", date: "" });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.date) params.date = filters.date;

    getAllRequestsAdmin(params)
      .then((res) => setRequests(res.data.requests))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const clearFilters = () => {
    setFilters({ search: "", status: "", category: "", date: "" });
  };

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.category || filters.date);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            Collection Operations
          </div>
          <h1 className="text-2xl font-extrabold text-darkforest tracking-tight">
            All Pickup Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Monitor, filter, and update status for all citizen doorstep pickups.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="btn-secondary self-start sm:self-auto !py-2 !px-3 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-forest-600" />
          Refresh Requests
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card !p-4 space-y-3 shadow-soft border-forest-200/80">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="input-field !pl-10 !py-2.5 text-sm"
            placeholder="Search by Request ID (e.g. WCR-2026-0001), citizen name, or phone number..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <select
              className="input-field !py-2 text-xs !bg-white"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {["PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED"].map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="input-field !py-2 text-xs !bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Waste Streams</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              className="input-field !py-2 text-xs !bg-white"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              title="Filter by Pickup Date"
            />
          </div>

          <div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary w-full !py-2 text-xs !text-rose-600 hover:!bg-rose-50 border-rose-200"
              >
                Reset Filters
              </button>
            ) : (
              <div className="hidden sm:flex items-center justify-end px-3 py-2 text-xs text-gray-400">
                {requests.length} total results
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Request Data Table */}
      <div className="card !p-0 overflow-x-auto shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-warm-50/70">
              <th className="p-4">Request</th>
              <th className="p-4">Citizen</th>
              <th className="p-4">Category</th>
              <th className="p-4">Pickup Schedule</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400 text-xs">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading requests...</span>
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400">
                  <div className="space-y-1">
                    <p className="font-bold text-darkforest text-sm">No pickup requests match your criteria</p>
                    <p className="text-xs text-gray-500">Try clearing active filters or searching a different term.</p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((r) => {
                const dateStr = new Date(r.pickupDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-warm-50/70 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/requests/${r.id}`)}
                  >
                    <td className="p-4 font-mono font-bold text-xs text-darkforest whitespace-nowrap">
                      {r.requestId}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-darkforest text-xs">
                        {r.user?.name || r.contactName || "Citizen"}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {r.phone || r.user?.phone || r.user?.email}
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-darkforest">
                        <span>{r.category?.icon}</span>
                        <span>{r.category?.name}</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-darkforest">{dateStr}</div>
                      <div className="text-[10px] text-gray-400">{r.timeSlot}</div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs text-gray-600">{r.city}</span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/requests/${r.id}`);
                        }}
                        className="text-xs font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 hover:text-forest-900 px-3 py-1.5 rounded-lg border border-forest-200 transition-colors"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

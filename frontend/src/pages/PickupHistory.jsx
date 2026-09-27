import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, PlusCircle, ArrowRight } from "lucide-react";
import { getMyRequests, getCategories } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import RequestCard from "../components/RequestCard";

const STATUS_FILTERS = ["ALL", "PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED"];

export default function PickupHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getMyRequests(), getCategories()])
      .then(([reqRes, catRes]) => {
        setRequests(reqRes.data.requests);
        setCategories(catRes.data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && r.categoryId !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.requestId?.toLowerCase().includes(q);
        const matchesCity = r.city?.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesCat = r.category?.name?.toLowerCase().includes(q);
        if (!matchesId && !matchesCity && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [requests, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-darkforest tracking-tight">Pickup History</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review all your past and upcoming doorstep waste collections
          </p>
        </div>
        <Link to="/requests/new" className="btn-primary self-start sm:self-auto !px-4">
          <PlusCircle className="w-4 h-4" />
          New Pickup Request
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="card !p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              className="input-field !pl-10 !py-2 text-sm"
              placeholder="Search by Request ID, category, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto shrink-0">
            <select
              className="input-field !py-2 text-sm !bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Waste Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? "bg-forest-700 text-white shadow-xs"
                  : "bg-warm-100 text-gray-600 hover:bg-forest-50 hover:text-forest-800"
              }`}
            >
              {s === "ALL" ? "All Requests" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results View: Cards on mobile, Table on Desktop */}
      {loading ? (
        <div className="card text-center py-12 text-gray-400 text-sm">Loading pickup history...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="card text-center py-12 px-4 space-y-3 border-dashed border-2 border-forest-200">
          <span className="text-3xl">🔍</span>
          <h3 className="font-bold text-darkforest text-base">No matching pickups found</h3>
          <p className="text-gray-500 text-xs max-w-sm mx-auto">
            Try adjusting your search query or status filter to see other requests.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Grid (hidden on desktop) */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {filteredRequests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="card !p-0 overflow-x-auto hidden sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-warm-50/60">
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Waste Category</th>
                  <th className="p-4">Pickup Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((r) => {
                  const dateStr = new Date(r.pickupDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-warm-50/70 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/requests/${r.id}`)}
                    >
                      <td className="p-4 font-mono font-bold text-xs text-darkforest">{r.requestId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{r.category?.icon}</span>
                          <span className="font-semibold text-darkforest">{r.category?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 text-xs whitespace-nowrap">{dateStr}</td>
                      <td className="p-4 text-gray-600 text-xs whitespace-nowrap">{r.city}</td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className="text-forest-700 font-semibold text-xs group-hover:underline inline-flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

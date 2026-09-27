import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Sparkles, ArrowRight, ShieldCheck, Leaf, Clock, Truck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyRequests } from "../services/api";
import RequestCard from "../components/RequestCard";
import StatCard from "../components/StatCard";

export default function UserDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then((res) => setRequests(res.data.requests))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    scheduled: requests.filter((r) => r.status === "SCHEDULED").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  // Determine friendly time of day greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.name?.split(" ")[0] || "Friend";

  return (
    <div className="space-y-6">
      {/* Top Banner: Warm Nature Welcome & Primary Action */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white border-none p-6 sm:p-8 shadow-lift">
        {/* Subtle decorative leaf background curve */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <svg width="280" height="280" viewBox="0 0 200 200" fill="currentColor">
            <path d="M100 20C55.8 20 20 55.8 20 100c0 30 16.5 56.1 41.2 70.1C55 140 70 90 120 70c40-16 60-40 60-40s-40 10-60 10c-30 0-50-20-20-20z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-fresh-300 border border-white/10 mb-1">
              <Leaf className="w-3.5 h-3.5" />
              Responsible Waste Initiative
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {timeGreeting}, {firstName} 👋
            </h1>
            <p className="text-forest-100 text-sm sm:text-base leading-relaxed">
              Ready to make a cleaner choice today? Schedule a doorstep collection for your sorted household or office waste.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/requests/new"
              className="inline-flex items-center justify-center gap-2 bg-fresh-400 hover:bg-fresh-300 text-forest-950 font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-5 h-5 text-forest-900" />
              <span>Schedule Pickup</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Environmental Motivational Card */}
      <div className="card bg-gradient-to-r from-forest-50 via-warm-50 to-emerald-50 border-forest-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0 text-xl shadow-xs">
            🌱
          </div>
          <div>
            <h2 className="font-bold text-darkforest text-sm sm:text-base">Your actions matter</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Every properly disposed waste item helps keep our community cleaner and prevents toxic landfill runoff.
            </p>
          </div>
        </div>
        <div className="shrink-0 bg-white/90 px-4 py-2 rounded-xl border border-forest-200 text-xs font-semibold text-forest-800 self-start sm:self-auto shadow-xs">
          ♻️ {counts.completed} {counts.completed === 1 ? "pickup" : "pickups"} completed
        </div>
      </div>

      {/* 4 Nature-Inspired Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pickups"
          value={counts.total}
          emoji="🌱"
          subtitle={counts.total > 0 ? "Lifetime doorstep pickups" : "Start your first pickup"}
          icon={Leaf}
          accent="text-forest-900"
          iconBg="bg-forest-100 text-forest-700"
        />
        <StatCard
          label="Pending"
          value={counts.pending}
          emoji="⏳"
          subtitle="Awaiting team review"
          icon={Clock}
          accent="text-amber-800"
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Scheduled"
          value={counts.scheduled}
          emoji="🚛"
          subtitle="Pickup confirmed"
          icon={Truck}
          accent="text-sky-800"
          iconBg="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Completed"
          value={counts.completed}
          emoji="♻️"
          subtitle="Safely processed"
          icon={CheckCircle2}
          accent="text-emerald-800"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-darkforest">Recent Requests</h2>
            <p className="text-xs text-gray-500">Track and monitor your latest collection appointments</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1 hover:underline"
          >
            View all history <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="card p-6 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card text-center py-12 px-4 space-y-4 border-dashed border-2 border-forest-200 bg-white/70">
            <div className="w-14 h-14 mx-auto rounded-full bg-forest-50 text-forest-600 flex items-center justify-center text-2xl">
              🌱
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-darkforest text-base">No pickups scheduled yet</h3>
              <p className="text-gray-500 text-sm">
                Ready to make your first responsible disposal? Choose what you have and we'll handle the rest.
              </p>
            </div>
            <Link to="/requests/new" className="btn-primary !px-5">
              <PlusCircle className="w-4 h-4" />
              Schedule Your First Pickup
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requests.slice(0, 4).map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

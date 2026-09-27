import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ClipboardList,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Layers,
} from "lucide-react";
import { getStatistics } from "../services/api";
import StatCard from "../components/StatCard";

// Nature-inspired status colors matching design tokens
const STATUS_COLORS = {
  PENDING: "#F59E0B",   // Amber
  SCHEDULED: "#0284C7", // Sky Blue
  PICKED_UP: "#9333EA", // Purple
  COMPLETED: "#16A34A", // Nature Green
  CANCELLED: "#E11D48", // Rose Red
};

// Nature-inspired category color palette
const CATEGORY_COLORS = ["#14532D", "#16A34A", "#4ADE80", "#84CC16", "#8B6F47", "#0284C7"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatistics()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Format data for Donut Chart
  const statusChartData = Object.entries(stats.statusCounts).map(([status, count]) => ({
    name: status.replace("_", " "),
    rawStatus: status,
    value: count,
  }));

  // Format data for Category Bar Chart
  const categoryBarData = stats.categoryDistribution.map((c) => ({
    name: c.name,
    count: c.count,
    percentage: c.percentage,
    icon: c.icon,
  }));

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            Operations Command Center
          </div>
          <h1 className="text-2xl font-extrabold text-darkforest tracking-tight">
            Good Morning, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Here's today's waste collection activity and distribution overview.
          </p>
        </div>

        <Link to="/admin/requests" className="btn-primary self-start sm:self-auto !px-4">
          <ClipboardList className="w-4 h-4" />
          Review All Requests
        </Link>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          emoji="📋"
          subtitle="All incoming pickup requests"
          icon={ClipboardList}
          accent="text-darkforest"
          iconBg="bg-warm-100 text-forest-800"
        />
        <StatCard
          label="Pending Review"
          value={stats.statusCounts.PENDING || 0}
          emoji="⏳"
          subtitle="Needs dispatcher scheduling"
          icon={Clock}
          accent="text-amber-800"
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Scheduled Active"
          value={stats.statusCounts.SCHEDULED || 0}
          emoji="🚛"
          subtitle="Routes assigned for pickup"
          icon={Truck}
          accent="text-sky-800"
          iconBg="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Completed"
          value={stats.statusCounts.COMPLETED || 0}
          emoji="♻️"
          subtitle="Successfully processed"
          icon={CheckCircle2}
          accent="text-emerald-800"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Nature-Themed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Status Donut Chart */}
        <div className="card space-y-4 border-forest-200/80">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-darkforest text-base">Requests by Status</h2>
              <p className="text-xs text-gray-500">Breakdown of operational collection stages</p>
            </div>
            <span className="text-xs font-semibold text-gray-400">Total: {stats.total}</span>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusChartData.map((entry) => (
                    <Cell
                      key={entry.rawStatus}
                      fill={STATUS_COLORS[entry.rawStatus] || "#94a3b8"}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} requests`, name]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-darkforest">{stats.total}</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Requests
              </span>
            </div>
          </div>

          {/* Status Legend Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-100">
            {statusChartData.map((entry) => (
              <div
                key={entry.rawStatus}
                className="flex items-center gap-1.5 text-xs text-gray-600 bg-warm-50 px-2.5 py-1 rounded-lg border border-gray-100"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[entry.rawStatus] }}
                />
                <span className="font-medium">{entry.name}:</span>
                <span className="font-bold text-darkforest">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Category Distribution Chart */}
        <div className="card space-y-4 border-forest-200/80">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-darkforest text-base">Waste Category Distribution</h2>
              <p className="text-xs text-gray-500">Collected volume breakdown across 6 waste streams</p>
            </div>
            <Leaf className="w-4 h-4 text-forest-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBarData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  formatter={(val) => [`${val} pickups`, "Count"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {categoryBarData.map((entry, idx) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Summary List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-xs">
            {stats.categoryDistribution.map((c, idx) => (
              <div
                key={c.name}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-warm-50/70 border border-gray-100"
              >
                <span className="text-sm shrink-0">{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-darkforest truncate">{c.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {c.count} ({c.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

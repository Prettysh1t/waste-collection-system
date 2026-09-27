import React from "react";

const STATUS_CONFIG = {
  PENDING: {
    emoji: "🟡",
    label: "Pending",
    classes: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  SCHEDULED: {
    emoji: "🔵",
    label: "Scheduled",
    classes: "bg-sky-50 text-sky-800 border-sky-200",
    dotClass: "bg-sky-500",
  },
  PICKED_UP: {
    emoji: "🟣",
    label: "Picked Up",
    classes: "bg-purple-50 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
  },
  COMPLETED: {
    emoji: "🟢",
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  CANCELLED: {
    emoji: "🔴",
    label: "Cancelled",
    classes: "bg-rose-50 text-rose-800 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

export default function StatusBadge({ status, className = "", showDotOnly = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes} ${className}`}
    >
      <span className="text-[11px] leading-none" role="img" aria-label={config.label}>
        {config.emoji}
      </span>
      <span>{config.label}</span>
    </span>
  );
}

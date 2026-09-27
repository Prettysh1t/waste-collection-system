import React from "react";

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  emoji,
  accent = "text-darkforest",
  iconBg = "bg-forest-50 text-forest-700",
}) {
  return (
    <div className="card hover:border-forest-300/80 transition-all p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {emoji && <span>{emoji}</span>}
            <span>{label}</span>
          </div>
          <p className={`text-3xl font-extrabold tracking-tight mt-1.5 ${accent}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center text-xs text-forest-700 font-medium">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}

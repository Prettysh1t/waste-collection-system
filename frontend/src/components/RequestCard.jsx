import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RequestCard({ request, adminView = false }) {
  const navigate = useNavigate();
  const date = new Date(request.pickupDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      role="button"
      tabIndex={0}
      className="card card-hover hover:border-forest-300 cursor-pointer p-5 flex flex-col justify-between group"
      onClick={() => navigate(adminView ? `/admin/requests/${request.id}` : `/requests/${request.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(adminView ? `/admin/requests/${request.id}` : `/requests/${request.id}`);
        }
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center text-xl shrink-0 border border-emerald-900/5 group-hover:scale-105 transition-transform">
              {request.category?.icon || "♻️"}
            </div>
            <div>
              <p className="text-[11px] font-mono font-semibold text-gray-400">{request.requestId}</p>
              <h3 className="font-bold text-darkforest text-base leading-tight mt-0.5 group-hover:text-forest-700 transition-colors">
                {request.category?.name || "Waste Pickup"}
              </h3>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {request.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-3 bg-warm-50/70 p-2 rounded-lg border border-emerald-900/5">
            {request.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100/90 flex items-center justify-between text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            {date}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            {request.city}
          </span>
        </div>

        <span className="text-forest-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold flex items-center gap-1">
          Details <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      {adminView && request.user && (
        <div className="mt-2 text-xs text-gray-500">
          Citizen: <span className="font-semibold text-darkforest">{request.user.name}</span>
        </div>
      )}
    </div>
  );
}

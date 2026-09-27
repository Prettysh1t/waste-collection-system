import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  Leaf,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  getRequestById,
  cancelRequest,
  getRequestByIdAdmin,
  updateRequestStatus,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const TIMELINE_STEPS = [
  { key: "SUBMITTED", label: "Request Submitted", desc: "Citizen scheduled pickup request" },
  { key: "REVIEWED", label: "Request Reviewed", desc: "Dispatcher verified location & waste category" },
  { key: "SCHEDULED", label: "Pickup Scheduled", desc: "Vehicle & crew assigned to route" },
  { key: "PICKED_UP", label: "Waste Picked Up", desc: "Collected from premises by team" },
  { key: "COMPLETED", label: "Completed", desc: "Delivered to licensed treatment/recycling center" },
];

function getStepState(stepIndex, currentStatus) {
  let activeIndex = 0;
  if (currentStatus === "PENDING") activeIndex = 1;
  else if (currentStatus === "SCHEDULED") activeIndex = 2;
  else if (currentStatus === "PICKED_UP") activeIndex = 3;
  else if (currentStatus === "COMPLETED") activeIndex = 5;

  if (stepIndex < activeIndex) return "completed";
  if (stepIndex === activeIndex) return "current";
  return "upcoming";
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", desc: "Awaiting review" },
  { value: "SCHEDULED", label: "Scheduled", desc: "Route confirmed" },
  { value: "PICKED_UP", label: "Picked Up", desc: "Collected by crew" },
  { value: "COMPLETED", label: "Completed", desc: "Recycling verified" },
  { value: "CANCELLED", label: "Cancelled", desc: "Voided" },
];

export default function RequestDetails({ adminView = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetcher = adminView ? getRequestByIdAdmin : getRequestById;

  const load = () => {
    setLoading(true);
    fetcher(id)
      .then((res) => {
        setRequest(res.data.request);
        setSelectedNewStatus(res.data.request.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this pickup request?")) return;
    try {
      await cancelRequest(request.id);
      setActionSuccess("Request cancelled successfully.");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request.");
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNewStatus) return;
    setUpdating(true);
    setActionSuccess("");
    try {
      await updateRequestStatus(request.id, {
        status: selectedNewStatus,
        note: statusNote.trim() || undefined,
      });
      setStatusNote("");
      setActionSuccess(`Status successfully updated to ${selectedNewStatus}.`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-8">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="card h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-md mx-auto card text-center py-12 space-y-4">
        <p className="text-gray-500">Request not found or you don't have permission to view it.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  const isCancelled = request.status === "CANCELLED";
  const dateFormatted = new Date(request.pickupDate).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top back navigation and ID bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(adminView ? "/admin/requests" : "/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-darkforest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {adminView ? "Back to All Requests" : "Back to Dashboard"}
        </button>
        <span className="font-mono text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-200">
          {request.requestId}
        </span>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Request Summary Card */}
      <div className="card space-y-6 border-forest-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-2xl shrink-0">
              {request.category?.icon || "♻️"}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-forest-700 uppercase tracking-wider">
                Waste Pickup Details
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-darkforest leading-tight">
                {request.category?.name}
              </h1>
            </div>
          </div>
          <StatusBadge status={request.status} className="self-start sm:self-auto !px-3 !py-1.5 !text-sm" />
        </div>

        {/* Customer & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-warm-50/70 p-3.5 rounded-xl border border-emerald-900/5 space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-forest-600" /> Pickup Date & Time
            </span>
            <p className="font-bold text-darkforest">{dateFormatted}</p>
            <p className="text-xs text-forest-700 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {request.timeSlot}
            </p>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-xl border border-emerald-900/5 space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest-600" /> Location Address
            </span>
            <p className="font-bold text-darkforest">{request.address}</p>
            <p className="text-xs text-gray-500">
              {request.city} - {request.pincode}
            </p>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-xl border border-emerald-900/5 space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-forest-600" /> Contact Person
            </span>
            <p className="font-bold text-darkforest">{request.contactName || request.user?.name || "Customer"}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Phone className="w-3 h-3 text-forest-600" /> {request.phone || request.user?.phone || "No phone provided"}
            </p>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-xl border border-emerald-900/5 space-y-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Quantity / Estimated Load
            </span>
            <p className="font-bold text-darkforest">{request.quantity || "Standard amount"}</p>
            {request.description && (
              <p className="text-xs text-gray-500 italic">"{request.description}"</p>
            )}
          </div>
        </div>

        {/* User Cancel Action */}
        {!adminView && !isCancelled && request.status !== "COMPLETED" && (
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Need to reschedule or withdraw this request?</span>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Pickup Request
            </button>
          </div>
        )}
      </div>

      {/* Visual Timeline Tracking */}
      {!isCancelled ? (
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-darkforest text-base">Request Progress Timeline</h2>
              <p className="text-xs text-gray-500">Live operational lifecycle of this collection request</p>
            </div>
            <span className="text-xs font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
              Active Stage
            </span>
          </div>

          <div className="py-2 pl-2">
            {TIMELINE_STEPS.map((step, idx) => {
              const state = getStepState(idx, request.status);
              const isLast = idx === TIMELINE_STEPS.length - 1;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Indicator Column */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        state === "completed"
                          ? "bg-forest-600 text-white shadow-xs"
                          : state === "current"
                          ? "bg-forest-700 text-white ring-4 ring-forest-200 animate-pulse"
                          : "bg-gray-100 text-gray-400 border border-gray-300"
                      }`}
                    >
                      {state === "completed" ? "✓" : state === "current" ? "●" : "○"}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-10 my-1 transition-colors ${
                          state === "completed" ? "bg-forest-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Text Column */}
                  <div className="pb-6">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm ${
                          state === "completed"
                            ? "text-darkforest font-bold"
                            : state === "current"
                            ? "text-forest-800 font-extrabold"
                            : "text-gray-400 font-medium"
                        }`}
                      >
                        {step.label}
                      </p>
                      {state === "current" && (
                        <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${state === "upcoming" ? "text-gray-400" : "text-gray-500"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card bg-rose-50/70 border-rose-200 p-5 flex items-center gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm">This request has been cancelled</span>
            No further collection or review actions will take place for this appointment.
          </div>
        </div>
      )}

      {/* Admin Status Management Panel */}
      {adminView && (
        <form onSubmit={handleStatusSubmit} className="card space-y-4 border-forest-300 shadow-soft">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-darkforest text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-600" />
              Update Collection Status (Admin Controls)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select the new status and optionally provide an audit note for the resident.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedNewStatus === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSelectedNewStatus(opt.value)}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    isSelected
                      ? "bg-forest-600 text-white border-forest-600 font-bold shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                  }`}
                >
                  <span className="block font-bold">{opt.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? "text-forest-100" : "text-gray-400"}`}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="label-text">Status Audit Note (Optional)</label>
            <input
              className="input-field text-sm"
              placeholder="e.g. Assigned driver Rajesh, vehicle MH-04-1234 scheduled for 10:30 AM"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={updating || selectedNewStatus === request.status}
              className="btn-primary !px-5"
            >
              {updating ? "Updating Status..." : "Apply Status Update"}
            </button>
          </div>
        </form>
      )}

      {/* Status History Audit Trail */}
      {request.history && request.history.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-bold text-darkforest text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-forest-600" />
            Status History & Audit Trail
          </h2>
          <div className="divide-y divide-gray-100 text-xs">
            {request.history.map((h) => (
              <div key={h.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={h.status} />
                    {h.changedBy && (
                      <span className="text-gray-500 font-medium">by {h.changedBy}</span>
                    )}
                  </div>
                  {h.note && <p className="text-gray-600 font-medium">{h.note}</p>}
                </div>
                <span className="text-gray-400 text-[11px] shrink-0 whitespace-nowrap">
                  {new Date(h.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

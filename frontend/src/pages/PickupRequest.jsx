import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  Leaf,
  Check,
} from "lucide-react";
import { getCategories, createRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const TIME_SLOTS = [
  { id: "09:00 AM – 12:00 PM", label: "Morning Slot", time: "09:00 AM – 12:00 PM", desc: "Best for early pickups" },
  { id: "12:00 PM – 03:00 PM", label: "Afternoon Slot", time: "12:00 PM – 03:00 PM", desc: "Midday collection" },
  { id: "03:00 PM – 06:00 PM", label: "Evening Slot", time: "03:00 PM – 06:00 PM", desc: "After-work collection" },
];

// Keyword-based Waste Disposal Helper
const KEYWORD_MAP = [
  {
    keywords: ["laptop", "phone", "mobile", "charger", "battery", "cable", "electronic", "tv", "monitor", "computer", "wire", "tablet", "printer"],
    category: "E-Waste",
    reason: "Electronic devices and chargers contain circuitry and batteries that should be handled as electronic waste.",
    suggestedAction: "Schedule an E-Waste pickup for licensed recycling.",
  },
  {
    keywords: ["chemical", "paint", "pesticide", "bulb", "tube light", "medicine", "acid", "solvent", "varnish", "thermometer"],
    category: "Hazardous Waste",
    reason: "Chemicals, paints, and toxic materials pose severe environmental hazards and require specialized containment.",
    suggestedAction: "Schedule a Hazardous Waste pickup for safe isolation.",
  },
  {
    keywords: ["food", "vegetable", "fruit", "peel", "leftover", "garden", "leaves", "compost", "grass", "meat"],
    category: "Organic/Wet Waste",
    reason: "Biodegradable organic matter can be safely composted into nutrient-rich soil.",
    suggestedAction: "Schedule an Organic/Wet Waste pickup.",
  },
  {
    keywords: ["bottle", "plastic", "paper", "cardboard", "glass", "can", "newspaper", "carton", "metal", "tin"],
    category: "Recyclable Waste",
    reason: "Paper, plastic, metal, and glass can be processed and remanufactured.",
    suggestedAction: "Schedule a Recyclable Waste pickup.",
  },
  {
    keywords: ["sofa", "mattress", "furniture", "table", "chair", "cupboard", "bed", "couch", "wardrobe"],
    category: "Bulk Waste",
    reason: "Oversized household furniture and fixtures require larger vehicles.",
    suggestedAction: "Schedule a Bulk Waste pickup.",
  },
];

function classifyWaste(text) {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry;
    }
  }
  return {
    category: "General Waste",
    reason: "Everyday non-hazardous household items not classified under separate streams.",
    suggestedAction: "Schedule a General Waste pickup.",
  };
}

export default function PickupRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Waste, 2: Location, 3: Schedule, 4: Confirm

  // Next 7 available pickup dates
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      dateString: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }),
      formatted: d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    };
  });

  const [form, setForm] = useState({
    categoryId: "",
    quantity: "",
    description: "",
    address: "",
    city: "Navi Mumbai",
    pincode: "",
    pickupDate: availableDates[0].dateString,
    timeSlot: TIME_SLOTS[0].id,
    contactName: user?.name || "",
    phone: user?.phone || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // AI Helper state
  const [helperText, setHelperText] = useState("");
  const [helperResult, setHelperResult] = useState(null);

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data.categories);
      if (res.data.categories.length > 0 && !form.categoryId) {
        setForm((prev) => ({ ...prev, categoryId: res.data.categories[0].id }));
      }
    });
  }, []);

  const runHelper = () => {
    if (!helperText.trim()) return;
    const res = classifyWaste(helperText);
    setHelperResult(res);
  };

  const applySuggestion = () => {
    if (!helperResult) return;
    const match = categories.find((c) => c.name === helperResult.category);
    if (match) {
      setForm((prev) => ({ ...prev, categoryId: match.id }));
    }
  };

  const validateStep = (step) => {
    setError("");
    if (step === 1) {
      if (!form.categoryId) {
        setError("Please choose a waste category.");
        return false;
      }
    } else if (step === 2) {
      if (!form.address.trim()) {
        setError("Please enter your street address.");
        return false;
      }
      if (!form.city.trim()) {
        setError("Please enter your city.");
        return false;
      }
      if (!form.pincode.trim()) {
        setError("Please enter your 6-digit postal pincode.");
        return false;
      }
    } else if (step === 3) {
      if (!form.pickupDate) {
        setError("Please select a preferred pickup date.");
        return false;
      }
      if (!form.timeSlot) {
        setError("Please select a preferred time slot.");
        return false;
      }
    } else if (step === 4) {
      if (!form.contactName.trim()) {
        setError("Please enter contact person name.");
        return false;
      }
      if (!form.phone.trim()) {
        setError("Please provide a contact phone number.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setError("");
    setLoading(true);
    try {
      const res = await createRequest(form);
      setSuccess(res.data.request);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const selectedDateObj = availableDates.find((d) => d.dateString === form.pickupDate);

  // Success Screen
  if (success) {
    const formattedDate = new Date(success.pickupDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="max-w-xl mx-auto card text-center py-12 px-6 sm:px-8 space-y-6 shadow-lift border-forest-200">
        <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-3xl mx-auto ring-8 ring-forest-50 animate-bounce">
          🌱
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-darkforest tracking-tight">
            Pickup Scheduled!
          </h1>
          <p className="text-gray-500 text-sm">
            Your request has been successfully submitted. Our team will review and dispatch collection.
          </p>
        </div>

        {/* Highlighted Confirmation Details */}
        <div className="bg-warm-100/90 rounded-2xl p-5 border border-forest-200/80 text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Request ID</span>
              <p className="font-mono text-lg font-bold text-forest-800">{success.requestId}</p>
            </div>
            <StatusBadge status="PENDING" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500 block">Waste Category</span>
              <span className="font-bold text-darkforest flex items-center gap-1.5 mt-0.5">
                <span>{success.category?.icon || selectedCategory?.icon}</span>
                <span>{success.category?.name || selectedCategory?.name}</span>
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Pickup Date</span>
              <span className="font-bold text-darkforest mt-0.5 block">{formattedDate}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Time Slot</span>
              <span className="font-bold text-darkforest mt-0.5 block">{success.timeSlot}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Location</span>
              <span className="font-bold text-darkforest mt-0.5 block truncate">{success.city}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-forest-800 font-medium">
          "Thank you for helping keep our community clean. 🌍"
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/requests/${success.id}`)}
            className="btn-primary w-full sm:w-auto !py-3"
          >
            Track Request
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn-secondary w-full sm:w-auto !py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-darkforest tracking-tight">Schedule a Waste Pickup</h1>
        <p className="text-gray-500 text-sm mt-1">
          Follow the 4 simple steps to arrange a convenient doorstep waste collection.
        </p>
      </div>

      {/* Step Progress Indicator */}
      <div className="card !p-4 bg-white/95">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Waste" },
            { num: 2, label: "Location" },
            { num: 3, label: "Schedule" },
            { num: 4, label: "Confirm" },
          ].map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-forest-600 text-white"
                        : isCurrent
                        ? "bg-forest-700 text-white ring-4 ring-forest-100"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-wide ${
                      isCurrent ? "text-forest-800" : isCompleted ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${
                      currentStep > step.num ? "bg-forest-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="font-bold text-rose-500">✕</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: WASTE CATEGORY & DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Waste Disposal Helper */}
            <div className="card bg-gradient-to-r from-forest-50/80 via-warm-50 to-emerald-50 border-forest-200/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-forest-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-forest-600" />
                <span>Not sure what category? Try the Waste Disposal Helper</span>
              </div>
              <p className="text-xs text-gray-600">
                Type the items you want to dispose (e.g. "old laptop and mobile charger", "plastic bottles", "broken mirror"):
              </p>
              <div className="flex gap-2">
                <input
                  className="input-field bg-white"
                  placeholder='e.g. "Old laptop and broken charger"'
                  value={helperText}
                  onChange={(e) => setHelperText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runHelper();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={runHelper}
                  className="btn-secondary !bg-white whitespace-nowrap !px-4"
                >
                  Ask Helper
                </button>
              </div>

              {helperResult && (
                <div className="mt-3 text-xs bg-white rounded-xl p-4 border border-forest-200 space-y-2 shadow-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      Recommended Category
                    </span>
                    <p className="text-sm font-bold text-forest-800">{helperResult.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Reason</span>
                    <p className="text-gray-700">{helperResult.reason}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      Suggested Action
                    </span>
                    <p className="text-gray-700">{helperResult.suggestedAction}</p>
                  </div>
                  <button
                    type="button"
                    onClick={applySuggestion}
                    className="text-forest-700 font-bold text-xs hover:underline flex items-center gap-1 pt-1"
                  >
                    Select {helperResult.category} for this request →
                  </button>
                </div>
              )}
            </div>

            {/* Visual Waste Category Cards */}
            <div className="card space-y-4">
              <div>
                <label className="label-text">Select Waste Category *</label>
                <p className="text-xs text-gray-500 mb-3">
                  Choose the right category to help us handle your waste responsibly.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isSelected = form.categoryId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setForm({ ...form, categoryId: cat.id })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setForm({ ...form, categoryId: cat.id });
                          }
                        }}
                        className={`relative p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-forest-600 bg-forest-50/90 shadow-soft -translate-y-0.5 ring-2 ring-forest-500/20"
                            : "border-gray-200 bg-white hover:border-forest-300 hover:bg-warm-50/50"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-forest-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div>
                          <div className="font-bold text-darkforest text-sm leading-tight">{cat.name}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="label-text">Quantity / Approximate Amount</label>
                <input
                  className="input-field"
                  placeholder="e.g. 2 bags, ~5 kg, 1 old sofa, 3 small boxes"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text">Description / Special Instructions (Optional)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Any details to help our collection crew (e.g. left near main lobby gate, fragile glass)..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION DETAILS */}
        {currentStep === 2 && (
          <div className="card space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-bold text-darkforest text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-600" />
                Pickup Location
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Please provide an accurate location so our collection team can find you easily.
              </p>
            </div>

            <div>
              <label className="label-text">Street Address / House / Flat No. *</label>
              <input
                required
                className="input-field"
                placeholder="Flat 402, Green Meadows, Sector 14"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">City *</label>
                <input
                  required
                  className="input-field"
                  placeholder="Navi Mumbai"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">Pincode *</label>
                <input
                  required
                  maxLength={6}
                  className="input-field"
                  placeholder="410206"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-xl bg-warm-100 p-3 text-xs text-forest-800 flex items-center gap-2 border border-forest-200">
              <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
              <span>Our collection drivers will call you when they are 15 minutes away from your location.</span>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & TIME SLOTS */}
        {currentStep === 3 && (
          <div className="card space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-bold text-darkforest text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-600" />
                Choose Pickup Schedule
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Select your preferred date and time slot for doorstep pickup.</p>
            </div>

            <div>
              <label className="label-text">Choose Pickup Date *</label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {availableDates.map((d) => {
                  const isSelected = form.pickupDate === d.dateString;
                  return (
                    <button
                      type="button"
                      key={d.dateString}
                      onClick={() => setForm({ ...form, pickupDate: d.dateString })}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-forest-600 text-white border-forest-600 shadow-soft ring-2 ring-forest-500/20"
                          : "bg-white text-gray-700 border-gray-200 hover:border-forest-300 hover:bg-warm-50"
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${isSelected ? "text-forest-100" : "text-gray-400"}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-extrabold my-0.5">{d.dayNum}</span>
                      <span className={`text-[10px] ${isSelected ? "text-forest-100" : "text-gray-500"}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label-text">Available Time Slot *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = form.timeSlot === slot.id;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setForm({ ...form, timeSlot: slot.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-forest-50 border-forest-600 shadow-soft ring-2 ring-forest-500/20"
                          : "bg-white border-gray-200 hover:border-forest-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-darkforest">{slot.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? "border-forest-600 bg-forest-600 text-white" : "border-gray-300"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-forest-800 mt-1">{slot.time}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{slot.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT DETAILS & CONFIRMATION RECAP */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="card space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="font-bold text-darkforest text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-forest-600" />
                  Contact Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Who should our driver contact upon arrival?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Contact Name *</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Full name"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-text">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    className="input-field"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Request Summary Recap Card */}
            <div className="card bg-warm-50/80 border-forest-200 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Please Review Your Pickup Request
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block font-semibold">Category</span>
                  <p className="font-bold text-darkforest text-sm flex items-center gap-1.5 mt-0.5">
                    <span>{selectedCategory?.icon}</span>
                    <span>{selectedCategory?.name}</span>
                  </p>
                  {form.quantity && <p className="text-gray-500 mt-0.5">Qty: {form.quantity}</p>}
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block font-semibold">Pickup Time</span>
                  <p className="font-bold text-darkforest text-sm mt-0.5">
                    {selectedDateObj?.formatted || form.pickupDate}
                  </p>
                  <p className="text-forest-700 font-medium mt-0.5">{form.timeSlot}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 sm:col-span-2">
                  <span className="text-gray-400 block font-semibold">Location</span>
                  <p className="font-bold text-darkforest mt-0.5">
                    {form.address}, {form.city} - {form.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 ? (
            <button type="button" onClick={handleBack} className="btn-secondary !px-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button type="button" onClick={handleNext} className="btn-primary !px-6">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary !px-8 !py-3 font-bold text-base shadow-lift">
              {loading ? "Scheduling..." : "♻️ Schedule Waste Pickup"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") setForm({ email: "admin@wasteapp.com", password: "admin123" });
    else setForm({ email: "user@wasteapp.com", password: "user123" });
  };

  return (
    <div className="min-h-screen flex bg-warm-100">
      {/* Left side: Environmental Hero Illustration & Narrative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white relative overflow-hidden flex-col justify-between p-12 select-none">
        {/* Subtle background environmental decorative patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 5 C10 15 10 25 20 35 C30 25 30 15 20 5 Z" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        </div>

        {/* Brand header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-forest-200">
            <span className="w-2 h-2 rounded-full bg-fresh-400 animate-pulse" />
            Empowering Clean & Sustainable Neighborhoods
          </div>
        </div>

        {/* Hero Illustration & Core Message */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          {/* Custom SVG Illustration: Eco Landscape, Vehicle & Clean City */}
          <div className="w-full h-56 rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden relative shadow-inner">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Sun & Sky */}
              <circle cx="340" cy="50" r="24" fill="#FEF08A" opacity="0.85" />
              <path d="M50 45 Q70 30 90 45 T130 45" stroke="#BAE6FD" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M220 35 Q235 25 250 35 T280 35" stroke="#BAE6FD" strokeWidth="1.5" fill="none" opacity="0.4" />

              {/* Clean City Silhouette in Background */}
              <rect x="70" y="70" width="30" height="60" rx="3" fill="#14532D" opacity="0.4" />
              <rect x="110" y="55" width="26" height="75" rx="3" fill="#14532D" opacity="0.5" />
              <rect x="145" y="80" width="35" height="50" rx="3" fill="#14532D" opacity="0.4" />
              <rect x="270" y="65" width="32" height="65" rx="3" fill="#14532D" opacity="0.4" />

              {/* Wind Turbines */}
              <line x1="190" y1="60" x2="190" y2="120" stroke="#86EFAC" strokeWidth="2" opacity="0.6" />
              <circle cx="190" cy="60" r="3" fill="#86EFAC" />

              {/* Rolling Green Hills */}
              <path d="M-20 180 Q100 110 240 160 T450 140 L450 220 L-20 220 Z" fill="#15803D" />
              <path d="M-20 190 Q120 150 280 180 T450 165 L450 220 L-20 220 Z" fill="#166534" />

              {/* Trees */}
              <circle cx="45" cy="140" r="14" fill="#22C55E" />
              <rect x="43" y="148" width="4" height="16" fill="#78350F" />
              <circle cx="65" cy="148" r="11" fill="#4ADE80" />
              <rect x="63" y="154" width="4" height="14" fill="#78350F" />

              <circle cx="340" cy="145" r="16" fill="#22C55E" />
              <rect x="338" y="155" width="4" height="15" fill="#78350F" />

              {/* Electric Collection Vehicle */}
              <g transform="translate(180, 130)">
                <rect x="0" y="10" width="55" height="26" rx="4" fill="#FFFFFF" />
                <rect x="38" y="14" width="14" height="12" rx="2" fill="#38BDF8" />
                <rect x="6" y="14" width="26" height="18" rx="2" fill="#22C55E" opacity="0.25" />
                {/* Recycling symbol on truck */}
                <text x="14" y="27" fontSize="11" fill="#166534" fontWeight="bold">♻</text>
                {/* Wheels */}
                <circle cx="14" cy="38" r="6" fill="#1F2937" />
                <circle cx="14" cy="38" r="2" fill="#D1D5DB" />
                <circle cx="44" cy="38" r="6" fill="#1F2937" />
                <circle cx="44" cy="38" r="2" fill="#D1D5DB" />
              </g>

              {/* Road */}
              <path d="M0 185 Q200 178 400 185" stroke="#E5E7EB" strokeWidth="3" strokeDasharray="8 6" opacity="0.3" />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Dispose Responsibly.<br />
              <span className="text-fresh-400">Protect Tomorrow.</span>
            </h2>
            <p className="text-forest-100 text-sm mt-3 leading-relaxed">
              Schedule waste collection easily and take a small step toward a cleaner, greener community. Every pickup helps divert waste to responsible recycling and safe treatment facilities.
            </p>
          </div>

          {/* Social Proof / Environmental Impact Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-fresh-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Certified
              </div>
              <p className="text-white text-xs mt-1">Responsible disposal & licensed eco-recycling</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-fresh-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Doorstep Collection
              </div>
              <p className="text-white text-xs mt-1">Scheduled at your preferred time window</p>
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 text-xs text-forest-300">
          "Small responsible actions create a cleaner planet." — WasteCare Initiative
        </div>
      </div>

      {/* Right side: Modern, Welcoming Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Brand header */}
          <div className="space-y-2">
            <BrandLogo size="lg" withTagline={true} />
            <h1 className="text-2xl font-bold tracking-tight text-darkforest pt-2">Welcome Back</h1>
            <p className="text-sm text-gray-500">
              Sign in to manage your waste pickups and track collection status.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-xl flex items-start gap-2 animate-fadeIn">
              <span className="text-rose-500 font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card space-y-4 shadow-soft">
            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-text !mb-0">Password</label>
              </div>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-center mb-2">
                Quick Test with Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("user")}
                  className="btn-secondary !py-2 !text-xs !bg-warm-50 hover:!bg-white"
                >
                  👤 User Account
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="btn-secondary !py-2 !text-xs !bg-warm-50 hover:!bg-white"
                >
                  🛡️ Admin Account
                </button>
              </div>
            </div>
          </form>

          {/* Registration link */}
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-forest-700 hover:text-forest-800 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

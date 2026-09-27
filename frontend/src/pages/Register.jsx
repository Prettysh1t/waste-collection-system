import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-100">
      {/* Left side: Environmental Hero Illustration & Narrative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white relative overflow-hidden flex-col justify-between p-12 select-none">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-forest-200">
            <span className="w-2 h-2 rounded-full bg-fresh-400 animate-pulse" />
            Join the Clean Planet Movement
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="w-full h-52 rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden shadow-inner">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Sun & Rays */}
              <circle cx="200" cy="80" r="30" fill="#FEF08A" opacity="0.8" />
              {/* Forest & Mountain Silhouettes */}
              <path d="M-10 180 L80 90 L170 180 Z" fill="#14532D" opacity="0.7" />
              <path d="M120 180 L220 70 L320 180 Z" fill="#166534" opacity="0.8" />
              <path d="M260 180 L340 100 L420 180 Z" fill="#15803D" opacity="0.6" />
              {/* Earth Curve */}
              <path d="M-20 195 Q200 160 420 195 L420 220 L-20 220 Z" fill="#047857" />
              {/* Plant seedling growing */}
              <g transform="translate(195, 135)">
                <path d="M5 25 Q5 5 2 0 Q15 0 20 10 Q10 15 5 25" fill="#4ADE80" />
                <path d="M5 25 Q5 10 -8 5 Q-12 18 5 25" fill="#86EFAC" />
                <circle cx="5" cy="27" r="4" fill="#8B6F47" />
              </g>
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Small actions.<br />
              <span className="text-fresh-400">Cleaner Tomorrow.</span>
            </h2>
            <p className="text-forest-100 text-sm mt-3 leading-relaxed">
              Register now to easily schedule pickups for electronic waste, recyclables, organic compost, and oversized items from the comfort of your home.
            </p>
          </div>

          <div className="space-y-2 text-sm text-forest-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fresh-400 shrink-0" />
              <span>Free doorstep collection for sorted recyclables</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fresh-400 shrink-0" />
              <span>Certified handling for e-waste & hazardous goods</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fresh-400 shrink-0" />
              <span>Real-time status tracking from request to pickup</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-forest-300">
          "The greatest threat to our planet is the belief that someone else will save it."
        </div>
      </div>

      {/* Right side: Register Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <BrandLogo size="lg" withTagline={true} />
            <h1 className="text-2xl font-bold tracking-tight text-darkforest pt-2">Create Account</h1>
            <p className="text-sm text-gray-500">
              Join your neighbors in responsible community waste disposal.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card space-y-4 shadow-soft">
            <div>
              <label className="label-text">Full Name</label>
              <input
                required
                className="input-field"
                placeholder="Jane Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">Phone Number</label>
              <input
                type="tel"
                required
                className="input-field"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-forest-700 hover:text-forest-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

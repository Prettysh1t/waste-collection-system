import React from "react";

export default function BrandLogo({ size = "md", withTagline = false, className = "" }) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 text-white shadow-sm ring-2 ring-forest-600/20 shrink-0`}
      >
        {/* Nature Leaf & Recycling Hybrid SVG Mark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          {/* Stylized leaf with recycling contour */}
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-darkforest ${textSizes[size]}`}>
          Waste<span className="text-forest-600">Care</span>
        </span>
        {withTagline && (
          <span className="text-[10px] tracking-wide text-gray-500 font-medium mt-1">
            Dispose Responsibly. Protect Tomorrow.
          </span>
        )}
      </div>
    </div>
  );
}

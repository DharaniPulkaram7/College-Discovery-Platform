"use client";

import { useState } from "react";

export default function FilterSection({ filters, onChange }) {
  const [expanded, setExpanded] = useState({
    location: true,
    fees: true,
    rating: true,
  });

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleExpanded = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    });
  };

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

      {/* Location Filter */}
      <div className="mb-6 border-b pb-6">
        <button
          onClick={() => toggleExpanded("location")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-800">Location</h3>
          <svg
            className={`w-4 h-4 transition-transform ${
              expanded.location ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {expanded.location && (
          <div className="space-y-2">
            <select
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="input-field"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Fees Filter */}
      <div className="mb-6 border-b pb-6">
        <button
          onClick={() => toggleExpanded("fees")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-800">Fees (Annual)</h3>
          <svg
            className={`w-4 h-4 transition-transform ${
              expanded.fees ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {expanded.fees && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Min</label>
              <input
                type="number"
                placeholder="Min fees"
                value={filters.minFees}
                onChange={(e) => handleChange("minFees", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Max</label>
              <input
                type="number"
                placeholder="Max fees"
                value={filters.maxFees}
                onChange={(e) => handleChange("maxFees", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleExpanded("rating")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-800">Minimum Rating</h3>
          <svg
            className={`w-4 h-4 transition-transform ${
              expanded.rating ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {expanded.rating && (
          <div className="space-y-2">
            <select
              value={filters.minRating}
              onChange={(e) => handleChange("minRating", e.target.value)}
              className="input-field"
            >
              <option value="">All Ratings</option>
              <option value="3">3+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
        )}
      </div>

      {/* Clear Button */}
      <button
        onClick={() =>
          onChange({
            search: "",
            location: "",
            minFees: "",
            maxFees: "",
            minRating: "",
            page: 1,
          })
        }
        className="btn-secondary w-full"
      >
        Clear All Filters
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import apiClient from "@/lib/apiClient";

export default function CollegeCard({ college }) {
  const { token } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      checkIfSaved();
    }
  }, [token]);

  const checkIfSaved = async () => {
    try {
      const { data } = await apiClient.get(`/saved/${college.id}/check`);
      setIsSaved(data.data.isSaved);
    } catch (error) {
      console.error("Error checking if saved:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!token) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await apiClient.delete(`/saved/${college.id}`);
        setIsSaved(false);
      } else {
        await apiClient.post(`/saved/${college.id}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving college:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/colleges/${college.id}`}>
      <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {college.name}
            </h3>
            <p className="text-sm text-gray-500">
              {college.city}, {college.state}
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSaveClick();
            }}
            disabled={isLoading}
            className="ml-2 flex-shrink-0"
            aria-label={isSaved ? "Remove from saved" : "Save college"}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isSaved
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 hover:text-red-500"
              } ${isLoading ? "opacity-50" : ""}`}
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 flex-1">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Rating</p>
            <p className="text-lg font-bold text-blue-600">
              {college.rating.toFixed(1)}/5
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Placement</p>
            <p className="text-lg font-bold text-green-600">
              {college.placement.toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Fees/Year</p>
            <p className="text-sm font-bold text-purple-600">
              ₹{(college.averageFees / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Reviews Info */}
        <div className="text-sm text-gray-600 mb-4">
          <p>
            {college.reviewCount} review
            {college.reviewCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="btn-primary w-full text-center"
        >
          View Details
        </button>
      </div>
    </Link>
  );
}

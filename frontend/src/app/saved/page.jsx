"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import CollegeCard from "@/components/CollegeCard";

export default function SavedColleges() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSavedColleges();
  }, [token, currentPage]);

  const fetchSavedColleges = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get("/saved", {
        params: { page: currentPage },
      });

      if (!data.data) {
        setColleges([]);
        setPagination(null);
        return;
      }

      setColleges(data.data.colleges || []);
      setPagination(data.data.pagination);
    } catch (err) {
      setError("Failed to load saved colleges");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Saved Colleges
        </h1>
        <p className="text-gray-600 mb-8">
          View and manage your saved colleges
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card h-64 skeleton" aria-hidden="true" />
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No saved colleges yet
            </h3>
            <p className="text-gray-600 mb-6">
              Browse colleges and save your favorites to view them here
            </p>
            <a href="/" className="btn-primary inline-block">
              Explore Colleges
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-outline disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

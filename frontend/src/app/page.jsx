"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import FilterSection from "@/components/FilterSection";
import apiClient from "@/lib/apiClient";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    minFees: "",
    maxFees: "",
    minRating: "",
    page: 1,
  });

  useEffect(() => {
    fetchColleges();
  }, [filters]);

  const fetchColleges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        search: filters.search || undefined,
        location: filters.location || undefined,
        minFees: filters.minFees ? parseInt(filters.minFees) : undefined,
        maxFees: filters.maxFees ? parseInt(filters.maxFees) : undefined,
        minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
        page: filters.page,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) =>
        params[key] === undefined && delete params[key]
      );

      const { data } = await apiClient.get("/colleges", { params });

      if (!data.data || !data.data.colleges) {
        setColleges([]);
        setPagination(null);
        return;
      }

      setColleges(data.data.colleges);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError("Failed to load colleges. Please try again.");
      setColleges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Perfect College
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Find, compare, and choose from top colleges across India
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSection filters={filters} onChange={handleFilterChange} />
          </aside>

          {/* Colleges List */}
          <main className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="card h-64 skeleton"
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No colleges found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      location: "",
                      minFees: "",
                      maxFees: "",
                      minRating: "",
                      page: 1,
                    })
                  }
                  className="btn-primary"
                >
                  Clear Filters
                </button>
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
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="btn-outline disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pagination.page === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn-outline disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

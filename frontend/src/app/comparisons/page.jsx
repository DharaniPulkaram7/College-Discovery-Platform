"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import apiClient from "@/lib/apiClient";

export default function Comparisons() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [allColleges, setAllColleges] = useState([]);
  const [comparisonName, setComparisonName] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchComparisons();
    fetchAllColleges();
  }, [token]);

  const fetchComparisons = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get("/comparisons");
      setComparisons(data.data.comparisons || []);
    } catch (err) {
      setError("Failed to load comparisons");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllColleges = async () => {
    try {
      const { data } = await apiClient.get("/colleges", {
        params: { limit: 100 },
      });
      setAllColleges(data.data.colleges || []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  const handleCreateComparison = async (e) => {
    e.preventDefault();

    if (selectedColleges.length < 2 || selectedColleges.length > 3) {
      alert("Please select 2-3 colleges");
      return;
    }

    try {
      const { data } = await apiClient.post("/comparisons", {
        collegeIds: selectedColleges,
        name: comparisonName || `Comparison ${new Date().toLocaleDateString()}`,
      });

      setComparisons([...comparisons, data.data]);
      setSelectedColleges([]);
      setComparisonName("");
      setShowForm(false);
    } catch (err) {
      console.error("Error creating comparison:", err);
      alert("Failed to create comparison");
    }
  };

  const handleDeleteComparison = async (id) => {
    if (confirm("Are you sure you want to delete this comparison?")) {
      try {
        await apiClient.delete(`/comparisons/${id}`);
        setComparisons(comparisons.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error deleting comparison:", err);
      }
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Compare Colleges
          </h1>
          <p className="text-gray-600">
            Compare multiple colleges side-by-side to make informed decisions
          </p>
        </div>

        {/* Create Comparison Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-8"
          >
            + New Comparison
          </button>
        ) : (
          <form
            onSubmit={handleCreateComparison}
            className="bg-white rounded-lg shadow p-6 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Comparison</h2>

            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-3">
                Select Colleges (2-3)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {allColleges.map((college) => (
                  <label key={college.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedColleges.includes(college.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (selectedColleges.length < 3) {
                            setSelectedColleges([
                              ...selectedColleges,
                              college.id,
                            ]);
                          }
                        } else {
                          setSelectedColleges(
                            selectedColleges.filter((id) => id !== college.id)
                          );
                        }
                      }}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-gray-800">{college.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-2">
                Comparison Name (Optional)
              </label>
              <input
                type="text"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="E.g., Top Tech Colleges"
                className="input-field"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                Create Comparison
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedColleges([]);
                  setComparisonName("");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Comparisons List */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card h-40 skeleton" aria-hidden="true" />
            ))}
          </div>
        ) : comparisons.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No comparisons yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create a comparison to analyze colleges side by side
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map((comparison) => (
              <div key={comparison.id} className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {comparison.name}
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {comparison.colleges?.length || 0} colleges
                  </p>
                  <div className="space-y-1">
                    {comparison.colleges?.map((comp) => (
                      <p
                        key={comp.college.id}
                        className="text-sm text-gray-700"
                      >
                        • {comp.college.name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/comparisons/${comparison.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    View Comparison
                  </Link>
                  <button
                    onClick={() => handleDeleteComparison(comparison.id)}
                    className="btn-secondary px-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

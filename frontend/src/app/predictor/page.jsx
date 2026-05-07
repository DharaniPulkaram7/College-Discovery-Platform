"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState(1500);
  const [results, setResults] = useState([]);
  const [criteria, setCriteria] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setResults([]);
    setCriteria(null);

    try {
      const response = await apiClient.get("/predictor", {
        params: { exam, rank },
      });
      setResults(response.data.data.results);
      setCriteria(response.data.data.criteria);
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to fetch college predictions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            College Predictor
          </h1>
          <p className="text-gray-600 mb-6">
            Enter your exam and rank to see the best-fit colleges from our
            database.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="input-field"
              >
                <option>JEE</option>
                <option>NEET</option>
                <option>CAT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Rank
              </label>
              <input
                type="number"
                min={1}
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                {isLoading ? "Predicting..." : "Predict Colleges"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-4">
              {error}
            </div>
          )}
        </div>

        {criteria && (
          <div className="bg-white rounded-3xl shadow p-6 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Prediction Summary
            </h2>
            <p className="text-gray-700 mb-2">
              Exam: <strong>{exam}</strong>
            </p>
            <p className="text-gray-700 mb-2">
              Rank: <strong>{rank}</strong>
            </p>
            <p className="text-gray-700 mb-2">
              Target rating: <strong>{criteria.minRating.toFixed(1)}+</strong>
            </p>
            <p className="text-gray-700 mb-6">
              Target placement: <strong>{criteria.minPlacement}%+</strong>
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {results.length > 0 ? (
            results.map((college) => (
              <div
                key={college.id}
                className="bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row items-start gap-6"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {college.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {college.city}, {college.state}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Rating: <strong>{college.rating.toFixed(1)}/5</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Placement: <strong>{college.placement.toFixed(1)}%</strong>
                  </p>
                  <p className="text-gray-700">
                    Fees: <strong>₹{(college.averageFees / 100000).toFixed(1)}L</strong>
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {college.reviewCount} review{college.reviewCount !== 1 ? "s" : ""}
                </div>
              </div>
            ))
          ) : (
            criteria && (
              <div className="bg-white rounded-3xl shadow p-6 text-gray-700">
                No colleges matched the prediction criteria. Showing top colleges from the database.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

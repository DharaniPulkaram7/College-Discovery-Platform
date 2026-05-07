"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import useAuthStore from "@/store/authStore";

export default function ComparisonDetail() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchComparison();
  }, [params.id, token]);

  const fetchComparison = async () => {
    try {
      const { data } = await apiClient.get(`/comparisons/${params.id}`);
      setComparison(data.data);
    } catch (err) {
      setError("Failed to load comparison");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="skeleton h-96 rounded-lg"></div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg inline-block">
          {error || "Comparison not found"}
        </div>
        <Link href="/comparisons" className="btn-primary mt-6 inline-block">
          Back to Comparisons
        </Link>
      </div>
    );
  }

  const colleges = comparison.colleges.map((c) => c.college);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/comparisons"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Comparisons
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {comparison.name}
        </h1>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-800">
                  Criteria
                </th>
                {colleges.map((college) => (
                  <th
                    key={college.id}
                    className="px-6 py-4 text-left font-bold text-gray-800 min-w-64"
                  >
                    {college.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Rating
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {college.rating.toFixed(1)}
                      </span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Placement */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Placement %
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    <span className="text-2xl font-bold text-green-600">
                      {college.placement.toFixed(1)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Average Fees */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Avg Annual Fees
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{(college.averageFees / 100000).toFixed(1)}L
                    </span>
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Location
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    <div className="text-gray-700">
                      <p>{college.city}</p>
                      <p className="text-sm text-gray-600">{college.state}</p>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Review Count */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Reviews
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4 text-gray-700">
                    {college.reviewCount} review
                    {college.reviewCount !== 1 ? "s" : ""}
                  </td>
                ))}
              </tr>

              {/* Courses */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Courses
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    <div className="space-y-2">
                      {college.courses && college.courses.length > 0 ? (
                        college.courses.map((course) => (
                          <div
                            key={course.id}
                            className="text-sm bg-blue-50 p-2 rounded"
                          >
                            <p className="font-semibold text-gray-800">
                              {course.name}
                            </p>
                            <p className="text-gray-600">{course.duration}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-sm">No courses</p>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Latest Placement Data */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  Latest Placement Data
                </td>
                {colleges.map((college) => {
                  const latestPlacement =
                    college.placements && college.placements[0];
                  return (
                    <td key={college.id} className="px-6 py-4">
                      {latestPlacement ? (
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Year:</strong> {latestPlacement.year}
                          </p>
                          <p>
                            <strong>Avg Package:</strong> ₹
                            {latestPlacement.avgPackage}L
                          </p>
                          <p>
                            <strong>Max Package:</strong> ₹
                            {latestPlacement.maxPackage}L
                          </p>
                          <p>
                            <strong>Placed:</strong>{" "}
                            {latestPlacement.placed}/
                            {latestPlacement.totalStudents}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">No data</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          {colleges.map((college) => (
            <Link
              key={college.id}
              href={`/colleges/${college.id}`}
              className="btn-primary"
            >
              View {college.name}
            </Link>
          ))}
        </div>

        {/* Decision Recommendation */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Decision Insights
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Highest Rating
              </h3>
              <p className="text-gray-700">
                {
                  colleges.reduce((prev, current) =>
                    prev.rating > current.rating ? prev : current
                  ).name
                }{" "}
                with {Math.max(...colleges.map((c) => c.rating)).toFixed(1)}/5
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Best Placements
              </h3>
              <p className="text-gray-700">
                {
                  colleges.reduce((prev, current) =>
                    prev.placement > current.placement ? prev : current
                  ).name
                }{" "}
                with {Math.max(...colleges.map((c) => c.placement)).toFixed(1)}
                % placement rate
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Most Affordable
              </h3>
              <p className="text-gray-700">
                {
                  colleges.reduce((prev, current) =>
                    prev.averageFees < current.averageFees ? prev : current
                  ).name
                }{" "}
                with ₹
                {Math.min(...colleges.map((c) => c.averageFees / 100000)).toFixed(
                  1
                )}
                L annual fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import useAuthStore from "@/store/authStore";

export default function CollegeDetail() {
  const params = useParams();
  const { token } = useAuthStore();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [compareColleges, setCompareColleges] = useState([]);

  useEffect(() => {
    fetchCollege();
    if (token) {
      checkIfSaved();
    }
  }, [params.id, token]);

  const fetchCollege = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(`/colleges/${params.id}`);
      setCollege(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load college details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const { data } = await apiClient.get(`/saved/${params.id}/check`);
      setIsSaved(data.data.isSaved);
    } catch (error) {
      console.error("Error checking if saved:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      if (isSaved) {
        await apiClient.delete(`/saved/${params.id}`);
        setIsSaved(false);
      } else {
        await apiClient.post(`/saved/${params.id}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving college:", error);
    }
  };

  const handleCompareClick = () => {
    if (compareColleges.includes(params.id)) {
      setCompareColleges(compareColleges.filter((id) => id !== params.id));
    } else if (compareColleges.length < 3) {
      setCompareColleges([...compareColleges, params.id]);
    } else {
      alert("You can compare up to 3 colleges");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="skeleton h-96 rounded-lg"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg inline-block">
          {error || "College not found"}
        </div>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Back to Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
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
            Back to Colleges
          </Link>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {college.name}
              </h1>
              <p className="text-lg text-gray-600">
                {college.location}, {college.state}
              </p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleSaveClick}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isSaved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {isSaved ? "✓ Saved" : "Save"}
              </button>

              <button
                onClick={handleCompareClick}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  compareColleges.includes(params.id)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Overall Rating</p>
            <p className="text-4xl font-bold text-blue-600">
              {college.rating.toFixed(1)}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {college.reviewCount} reviews
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Placement %</p>
            <p className="text-4xl font-bold text-green-600">
              {college.placement.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Average Fees/Year</p>
            <p className="text-4xl font-bold text-purple-600">
              ₹{(college.averageFees / 100000).toFixed(1)}L
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Established</p>
            <p className="text-4xl font-bold text-orange-600">
              {college.established || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow border-b mb-0">
          <div className="flex border-b">
            {["overview", "courses", "placements", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {college.description ||
                  "No description available for this college."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Location Details
                  </h3>
                  <p className="text-gray-600">City: {college.city}</p>
                  <p className="text-gray-600">State: {college.state}</p>
                  <p className="text-gray-600">Country: {college.country}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Other Info
                  </h3>
                  <p className="text-gray-600">
                    Affiliation: {college.affiliationBody || "N/A"}
                  </p>
                  {college.websiteUrl && (
                    <a
                      href={college.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Programs Offered</h2>

              {college.courses && college.courses.length > 0 ? (
                <div className="space-y-4">
                  {college.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">
                        {course.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold text-gray-800">
                            {course.duration}
                          </p>
                        </div>
                        {course.specialization && (
                          <div>
                            <p className="text-gray-600">Specialization</p>
                            <p className="font-semibold text-gray-800">
                              {course.specialization}
                            </p>
                          </div>
                        )}
                        {course.cutoff && (
                          <div>
                            <p className="text-gray-600">Merit Cutoff</p>
                            <p className="font-semibold text-gray-800">
                              {course.cutoff}%
                            </p>
                          </div>
                        )}
                        {course.fees && (
                          <div>
                            <p className="text-gray-600">Fees</p>
                            <p className="font-semibold text-gray-800">
                              ₹{(course.fees / 100000).toFixed(1)}L
                            </p>
                          </div>
                        )}
                      </div>
                      {course.eligibility && (
                        <p className="text-sm text-gray-600 mt-3">
                          <strong>Eligibility:</strong> {course.eligibility}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No courses available</p>
              )}
            </div>
          )}

          {/* Placements Tab */}
          {activeTab === "placements" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Placement Data</h2>

              {college.placements && college.placements.length > 0 ? (
                <div className="space-y-4">
                  {college.placements.map((placement) => (
                    <div
                      key={placement.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="font-bold text-gray-900 mb-3">
                        Year {placement.year}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm">Total Students</p>
                          <p className="text-xl font-bold text-gray-800">
                            {placement.totalStudents}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Placed</p>
                          <p className="text-xl font-bold text-green-600">
                            {placement.placed}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Avg Package</p>
                          <p className="text-xl font-bold text-blue-600">
                            ₹{placement.avgPackage}L
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">
                            Max Package
                          </p>
                          <p className="text-xl font-bold text-purple-600">
                            ₹{placement.maxPackage}L
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No placement data available</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <ReviewSection collegeId={params.id} initialReviews={college.reviews} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ collegeId, initialReviews }) {
  const { token, user } = useAuthStore();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    content: "",
  });

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsAddingReview(true);
      const { data } = await apiClient.post(`/reviews/${collegeId}`, formData);

      setReviews([data.data, ...reviews]);
      setFormData({ rating: 5, title: "", content: "" });
    } catch (error) {
      console.error("Error adding review:", error);
    } finally {
      setIsAddingReview(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      {/* Add Review Form */}
      {token && (
        <form onSubmit={handleAddReview} className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-gray-800 mb-4">
            Share Your Experience
          </h3>

          <div className="mb-4">
            <label className="block font-semibold text-gray-800 mb-2">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
              className="input-field"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-gray-800 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Brief summary of your review"
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-gray-800 mb-2">
              Review
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Share your detailed experience..."
              className="input-field resize-none"
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isAddingReview}
            className="btn-primary"
          >
            {isAddingReview ? "Posting..." : "Post Review"}
          </button>
        </form>
      )}

      {!token && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-700 mb-4">
            Please log in to share your review
          </p>
          <Link href="/login" className="btn-primary">
            Log In
          </Link>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.user?.firstName} {review.user?.lastName}
                  </p>
                  <p className="text-yellow-500">★ {review.rating}/5</p>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 mb-2">{review.title}</h4>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

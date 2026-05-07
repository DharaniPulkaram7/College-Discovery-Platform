"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function Profile() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  if (!mounted || !token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Profile
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                First Name
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                {user?.firstName || "Not provided"}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Last Name
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                {user?.lastName || "Not provided"}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Member Since
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <button
              onClick={handleLogout}
              className="btn-secondary w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/users/forgotpassword", {
        email,
      });

      toast.success("Reset link sent to your email.");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password
        </h2>

        <div className="space-y-4">
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className={`w-full py-2 px-4 ${
              loading ? "bg-blue-300" : "bg-blue-600"
            } text-white rounded-lg hover:bg-blue-700 transition-colors`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

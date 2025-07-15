"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function verifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    const urlToken = window.location.href.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token?.length > 0) verifyUserEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md text-center">
        {verified ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              ✅ Email Verified!
            </h2>
            <p className="text-gray-700 mb-4">
              Your email has been successfully verified.
            </p>
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Go to Login
            </Link>
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              ❌ Verification Failed
            </h2>
            <p className="text-gray-700 mb-4">
              This verification link is invalid or expired.
            </p>
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Go to Signup
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Please wait a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}

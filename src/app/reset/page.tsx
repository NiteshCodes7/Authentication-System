"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("")
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [valid, setValid] = useState(true);
  const [match, setMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlToken = window.location.href.split("token=")[1];
    setToken(urlToken || "");
  }, []);

  const validatePassword = (pass: string) => {
    const chars = pass.split("");

    const hasUpper = chars.some((ch) => ch >= "A" && ch <= "Z");
    const hasLower = chars.some((ch) => ch >= "a" && ch <= "z");
    const hasDigit = chars.some((ch) => ch >= "0" && ch <= "9");
    const hasSpecial = chars.some(
      (ch) =>
        !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(
          ch
        )
    );

    return pass.length >= 8 && hasUpper && hasLower && hasDigit && hasSpecial;
  };

  const handleResetPassword = async () => {
    const isValid = validatePassword(password);
    setValid(isValid);
    setMatch(password === confirmPassword);

    if (!isValid) {
      toast.error("Password must meet all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/users/resetpassword", {
        token,
        email,
        newPassword: password,
      });


      toast.success("Password reset successful!");
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-green-600">✅ Success</h2>
          <p className="text-gray-700 mt-2">
            Password updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔒 Reset Password
        </h2>

        <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 text-black border border-gray-400 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />


        <div className="relative">
          <label className="p-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValid(true);
            }}
            className="w-full text-black px-4 py-2 mb-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={togglePassword}
            className="absolute right-3 top-11 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {!valid && (
            <div className="text-red-500 text-sm mb-2">
              Password must include:
              <ul className="list-disc pl-5 text-xs text-left">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          )}
        </div>

          <div>
          <label className="p-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setMatch(true);
          }}
          className="w-full text-black px-4 py-2 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 text-white rounded-xl ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

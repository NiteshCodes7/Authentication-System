"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const SignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/users/signup", user);

      console.log("SignUp successful", response.data);
      router.push("/login");
      
    } catch (error: any) {
      console.log("Sign Up failed", error)

      toast.error(error.message)
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length >= 8 &&
      user.userName.length > 0 &&
      passwordValid &&
      confirmPassword
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    console.log(confirmPassword)
  }, [user.password, passwordValid, confirmPassword, passwordMatch]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePassword = (pass: string) => {
    setUser((prev) => ({
      ...prev,
      password: pass,
    }));

    // Manual rules:
    const hasUpper = pass.split("").some((ch) => ch >= "A" && ch <= "Z");
    const hasLower = pass.split("").some((ch) => ch >= "a" && ch <= "z");
    const hasDigit = pass.split("").some((ch) => ch >= "0" && ch <= "9");
    const hasSpecial = pass
      .split("")
      .some(
        (ch) =>
          !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(ch)
      );

    const isLongEnough = pass.length >= 8;

    const isValid =
      hasUpper && hasLower && hasDigit && hasSpecial && isLongEnough;
    setPasswordValid(isValid);

    setPasswordMatch(pass === confirmPassword);
  };

  const handleConfirmPassoword = (confirmPass: string) => {
    setConfirmPassword(confirmPass);
    setPasswordMatch(confirmPass === user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form className="space-y-4" onSubmit={SignUp}>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="userName"
              type="text"
              required
              value={user.userName}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
              placeholder="John Doe"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
              placeholder="example@mail.com"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => handlePassword(e.target.value)}
              required
              placeholder="Enter Your Password"
              className={`w-full px-4 py-2 text-black ${
                !passwordValid
                  ? "border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  : "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }  rounded-xl `}
            />
            <p
              onClick={togglePassword}
              className="absolute right-3 top-8 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </p>
              {!passwordValid && (
                <div className="text-red-500 text-xs mt-1">
                  Password must contain:
                  <ul className="list-disc pl-5">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character (like @, #, $)</li>
                  </ul>
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              type="password"
              required
              onChange={(e) => handleConfirmPassoword(e.target.value)}
              placeholder="Confirm Your Password"
              className={`w-full px-4 py-2 border text-black ${
                confirmPassword === "" || passwordMatch
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              } rounded-xl focus:outline-none focus:ring-2`}
            />

            {confirmPassword && !passwordMatch && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full py-2 px-4 ${
              buttonDisabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 cursor-pointer"
            }  text-white rounded-xl transition-colors`}
          >
            {loading ? (
              <>
                <span className="flex justify-center items-center gap-2"><Loader className="animate-spin" /> Processing</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

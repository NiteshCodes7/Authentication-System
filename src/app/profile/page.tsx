"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [data, setData] = useState("nothing");
  const router = useRouter();

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await axios.get("/api/users/logout");
      toast.success("LogOut Successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Logout failed");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      const userId = res.data?.data?._id;
      if (userId) {
        setData(userId);
        toast.success("User details fetched");
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    if (data !== "nothing") {
      router.push(`/profile/${data}`);
    }
  }, [data, router]);

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">👤 Profile</h1>
        <p className="text-gray-600">Welcome to your profile page.</p>

        <button
          onClick={getUserDetails}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
        >
          Get Details
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

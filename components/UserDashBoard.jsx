"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Calendar, Clock, MessageSquare, User } from "lucide-react";

export function UserDashBoard() {
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      console.log(token, " token");
      const response = await fetch("/api/user_data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data, " Data recieved");
        setUserData(data);
      } else {
        // router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  if (!userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  const daysSinceStart = Math.floor(
    (new Date() - new Date(userData.startDate)) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Your NoFap Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="text-blue-500 dark:text-blue-400 mr-2" />
              <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Username
              </span>
            </div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-300">
              {userData.username}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="text-green-500 dark:text-green-400 mr-2" />
              <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                Start Date
              </span>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-300">
              {new Date(userData.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Award className="text-yellow-500 dark:text-yellow-400 mr-2" />
              <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Current Streak
              </span>
            </div>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-300">
              {userData.currentStreak} days
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="text-purple-500 dark:text-purple-400 mr-2" />
              <span className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                Days Since Start
              </span>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-300">
              {daysSinceStart} days
            </p>
          </div>
        </div>
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MessageSquare className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Motivational Message
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 italic">
            "{userData.motivationalMessage || "Stay strong and keep going!"}"
          </p>
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Last updated: {new Date(userData.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

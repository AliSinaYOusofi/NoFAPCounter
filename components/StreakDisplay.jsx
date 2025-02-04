"use client";

import { useState, useEffect } from "react";
import { Trophy, Calendar, Star, TrendingUp } from "lucide-react";

export function StreakDisplay({ currentStreak, startDate }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const daysSinceStart = Math.floor(
    (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4d4855] bg-gradient-to-br from-[#4d4855] to-black">
      <div
        className={`bg-[#2a2a2a] rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-500 ease-in-out ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
          Your NoFap Journey
        </h1>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#3a3a3a] rounded-full transform -rotate-3"></div>
          <div className="relative bg-[#2a2a2a] rounded-full p-8 text-center transform rotate-3 transition-transform hover:rotate-0 duration-300">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <span className="block text-6xl font-bold text-blue-400">
              {currentStreak}
            </span>
            <span className="text-2xl font-semibold text-blue-200">
              Days Strong!
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#3a3a3a] p-4 rounded-lg text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <span className="block text-sm font-medium text-gray-300">
              Start Date
            </span>
            <span className="block text-lg font-semibold text-green-300">
              {new Date(startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="bg-[#3a3a3a] p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <span className="block text-sm font-medium text-gray-300">
              Days Since Start
            </span>
            <span className="block text-lg font-semibold text-purple-300">
              {daysSinceStart}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">
            Keep going! Every day is a victory.
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${i < Math.min(currentStreak / 7, 5) ? "text-yellow-400" : "text-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

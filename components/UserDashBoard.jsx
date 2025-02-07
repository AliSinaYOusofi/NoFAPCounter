"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Calendar, Clock, MessageSquare, User } from "lucide-react";

import { QuoteShower } from "./QuoteShower";

const DashboardCard = ({ icon, label, value }) => (
  <div className="p-6 border border-gray-700 rounded-xl bg-opacity-70 shadow-md flex flex-col items-center text-center hover:shadow-xl transition duration-300">
    <div className="mb-3">{icon}</div>
    <span className="text-lg font-semibold text-gray-300">{label}</span>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

export function UserDashBoard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user_data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const daysSinceStart = Math.floor(
    (new Date() - new Date(userData?.startDate || new Date())) / (1000 * 60 * 60 * 24)
  );

  const DASHBOARD_ITEMS = [
    {
      icon: <User size={32} className="text-gray-400" />,
      label: "Username",
      value: userData.username,
    },
    {
      icon: <Calendar size={32} className="text-gray-400" />,
      label: "Start Date",
      value: new Date(userData.startDate).toLocaleDateString(),
    },
    {
      icon: <Award size={32} className="text-gray-400" />,
      label: "Current Streak",
      value: `${userData.currentStreak} days`,
    },
    {
      icon: <Clock size={32} className="text-gray-400" />,
      label: "Days Since Start",
      value: `${daysSinceStart} days`,
    },
  ];

  return (
    <div className="h-full w-screen flex md:flex-row flex-col items-start gap-x-2 gap-y-2 justify-center bg-black p-6">
      <div className="flex h-full flex-col bg-black bg-opacity-80 backdrop-blur-lg rounded-xl p-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {DASHBOARD_ITEMS.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </div>
        <div className="mt-6 p-6 border border-gray-700 rounded-xl bg-opacity-70 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare size={32} className="text-gray-400" />
            <span className="text-lg font-semibold text-gray-300">Motivational Message</span>
          </div>
          <p className="text-gray-400 italic text-center">
            "{userData.motivationalMessage || 'Stay strong and keep going!'}"
          </p>
        </div>
        {/* <div className="mt-6 text-sm text-gray-400 text-center">
          <p>Last updated: {new Date(userData.updated_at).toLocaleString()}</p>
        </div> */}
      </div>
      <div className="w-2/3 border h-full p-2 border-gray-700 rounded-xl">
        <QuoteShower />
      </div>
    </div>
  );
}
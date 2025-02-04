import GlassmorphismNavbar from "@/components/Navbar";
import ShowStreakDaysOnly from "@/components/ShowStreakDaysOnly";
import { Sidebar } from "../../components/Sidebar";
import { UserDashBoard } from "@/components/UserDashBoard";

import React from "react";

export default function page() {
  return (
    <div>
      {/* <GlassmorphismNavbar /> */}

      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex md:w-60 bg-blue-200">
            <Sidebar />
          </div>
          <div className="flex-1 bg-green-400 flex items-center justify-center">
            <ShowStreakDaysOnly streakDays={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'

import GlassmorphismNavbar from "@/components/Navbar";
import ShowStreakDaysOnly from "@/components/ShowStreakDaysOnly";
import { Sidebar } from "../../components/Sidebar";
import { UserDashBoard } from "@/components/UserDashBoard";
import { useState } from "react";
import { Menu } from "lucide-react";
import Tips from "@/components/Tips";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('streak'); // Default component to show

  // Function to handle sidebar item click
  const handleSidebarClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 p-2 bg-[#3d3845] rounded-full text-white"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex flex-1 overflow-hidden">
        {isOpen && (
          <div className="hidden md:flex md:w-60 bg-black">
            <Sidebar 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              onItemClick={handleSidebarClick} // Pass the function to Sidebar
              activeComponent={activeComponent} // Pass the active component name to Sidebar
            />
          </div>
        )}
        <div className={`flex-1 ${isOpen ? "md:w-[calc(100%-15rem)]" : "w-full"} bg-green-400 flex items-center justify-center`}>
          {activeComponent === 'streak' && <ShowStreakDaysOnly streakDays={4} />}
          {activeComponent === 'dashboard' && <UserDashBoard />}
          {activeComponent === 'tips' && <Tips />}
        </div>
      </div>
    </div>
  );
}

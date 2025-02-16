"use client";

import ShowStreakDaysOnly from "@/components/ShowStreakDaysOnly";
import { Sidebar } from "./Sidebar";
import { UserDashBoard } from "@/components/UserDashBoard";
import { useState } from "react";
import { Menu } from "lucide-react";
import Tips from "@/components/Tips";
import Goals from "@/components/Goals";
import ContributionGraph from "@/components/global/Contribution";
import Settings from "./Settings";
import ContributionWrapper from "./global/ContributionWrapper";

export default function DashboardWrapper() {
    const [isOpen, setIsOpen] = useState(true);
    const [activeComponent, setActiveComponent] = useState("streak");

    const handleSidebarClick = (componentName) => {
        setActiveComponent(componentName);
    };

    return (
        <div className="min-h-screen relative flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed z-[100] top-4 left-4 p-2   rounded-full text-white"
            >
                <Menu className="w-6 h-6 " />
            </button>
            <div className="flex flex-1 overflow-hidden">
                {isOpen && (
                    <div className=" md:flex md:w-60 bg-black">
                        <Sidebar
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onItemClick={handleSidebarClick}
                            activeComponent={activeComponent}
                            setActiveComponent={setActiveComponent}
                        />
                    </div>
                )}
                <div
                    className={`flex-1 ${isOpen ? "md:w-[calc(100%-15rem)]" : "w-full"} bg-green-400 flex items-center justify-center`}
                >
                    {activeComponent === "streak" && (
                        <ShowStreakDaysOnly key="streak" />
                    )}
                    {activeComponent === "dashboard" && (
                        <UserDashBoard key="dashboard" />
                    )}
                    {activeComponent === "tips" && <Tips key="tips" />}
                    {activeComponent === "goals" && <Goals key="goals" />}
                    {activeComponent === "graph" && (
                        <ContributionWrapper key="graph" />
                    )}
                    {activeComponent === 'settings' && <Settings />}
                </div>
            </div>
        </div>
    );
}
